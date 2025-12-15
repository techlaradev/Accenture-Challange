const { defineFeature, loadFeature } = require("jest-cucumber");
const api = require("../../utils/request");

const feature = loadFeature("src/bdd/features/RentingBooks.feature");

defineFeature(feature, (test) => {
  const validPassword = "Password123!";
  let invalidIsbn;

  let authUser;
  let token;
  let availableBooks = [];
  let book1;
  let book2;
  let response;
  let targetUserId;

  function uniqueUsername(prefix = "user") {
    return `${prefix}_${Date.now()}`;
  }

  async function createUser() {
    const creds = { userName: uniqueUsername("bookstore"), password: validPassword };
    const res = await api.post("/Account/v1/User").send(creds);
    expect(res.status).toBe(201);
    return { userId: res.body.userID, ...creds };
  }

  async function generateToken(userName, password) {
    const res = await api.post("/Account/v1/GenerateToken").send({ userName, password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    return res.body.token;
  }

  async function listBooks() {
    const res = await api.get("/BookStore/v1/Books");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.books)).toBe(true);
    expect(res.body.books.length).toBeGreaterThan(0);
    return res.body.books;
  }

  async function rentBooks({ userId, isbns, withAuth = true }) {
    const req = api.post("/BookStore/v1/Books");
    if (withAuth) req.set("Authorization", `Bearer ${token}`);

    return req.send({
      userId,
      collectionOfIsbns: isbns.map((isbn) => ({ isbn })),
    });
  }

  async function getUserDetails(userId) {
    return api.get(`/Account/v1/User/${userId}`).set("Authorization", `Bearer ${token}`);
  }

  test("List available books", ({ when, then }) => {
    when("I list the available books", async () => {
      response = await api.get("/BookStore/v1/Books");
    });

    then("it should return a list of books", () => {
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.books)).toBe(true);
      expect(response.body.books.length).toBeGreaterThan(0);
    });
  });

  test("Rent one book for an existing user", ({ given, and, when, then }) => {
    given("an existing user with a valid token", async () => {
      authUser = await createUser();
      token = await generateToken(authUser.userName, authUser.password);
      targetUserId = authUser.userId;
    });

    and("an available book exists", async () => {
      availableBooks = await listBooks();
      book1 = availableBooks[0];
    });

    when("I rent the available book", async () => {
      response = await rentBooks({ userId: targetUserId, isbns: [book1.isbn], withAuth: true });
    });

    then("the book should be rented successfully", async () => {
      expect([200, 201]).toContain(response.status);
      const details = await getUserDetails(targetUserId);
      expect(details.status).toBe(200);
      const rentedIsbns = (details.body.books || []).map((b) => b.isbn);
      expect(rentedIsbns).toContain(book1.isbn);
    });
  });

  test("Rent two books for an existing user", ({ given, and, when, then }) => {
    given("an existing user with a valid token", async () => {
      authUser = await createUser();
      token = await generateToken(authUser.userName, authUser.password);
      targetUserId = authUser.userId;
    });

    and("two available books exist", async () => {
      availableBooks = await listBooks();
      book1 = availableBooks[0];
      book2 = availableBooks[1];
    });

    when("I rent both books", async () => {
      response = await rentBooks({
        userId: targetUserId,
        isbns: [book1.isbn, book2.isbn],
        withAuth: true,
      });
    });

    then("the books should be rented successfully", async () => {
      expect([200, 201]).toContain(response.status);
      const details = await getUserDetails(targetUserId);
      expect(details.status).toBe(200);
      const rentedIsbns = (details.body.books || []).map((b) => b.isbn);
      expect(rentedIsbns).toContain(book1.isbn);
      expect(rentedIsbns).toContain(book2.isbn);
    });
  });

  test("List user details with rented books", ({ given, when, then }) => {
    given("an existing user with rented books", async () => {
      authUser = await createUser();
      token = await generateToken(authUser.userName, authUser.password);
      targetUserId = authUser.userId;

      availableBooks = await listBooks();
      book1 = availableBooks[0];
      book2 = availableBooks[1];

      const rentRes = await rentBooks({
        userId: targetUserId,
        isbns: [book1.isbn, book2.isbn],
        withAuth: true,
      });

      expect([200, 201]).toContain(rentRes.status);
    });

    when("I retrieve the user details", async () => {
      response = await getUserDetails(targetUserId);
    });

    then("the user should have the rented books", () => {
      expect(response.status).toBe(200);
      const rentedIsbns = (response.body.books || []).map((b) => b.isbn);
      expect(rentedIsbns).toContain(book1.isbn);
      expect(rentedIsbns).toContain(book2.isbn);
    });
  });

  test("Try to rent books without authentication", ({ given, and, when, then }) => {
    given("an existing user", async () => {
      authUser = await createUser();
      targetUserId = authUser.userId;
      token = undefined;
    });

    and("an available book exists", async () => {
      availableBooks = await listBooks();
      book1 = availableBooks[0];
    });

    when("I try to rent the book without authentication", async () => {
      response = await rentBooks({
        userId: targetUserId,
        isbns: [book1.isbn],
        withAuth: false,
      });
    });

    then("the book should not be rented and the user should be notified", () => {
      expect(response.status).not.toBe(201);
    });
  });

  test("Try to rent books for a non-existent user", ({ given, and, when, then }) => {
    given("a non-existent user", async () => {
      authUser = await createUser();
      token = await generateToken(authUser.userName, authUser.password);
      targetUserId = "00000000-0000-0000-0000-000000000000";
    });

    and("an available book exists", async () => {
      availableBooks = await listBooks();
      book1 = availableBooks[0];
    });

    when("I try to rent the book for that user", async () => {
      response = await rentBooks({
        userId: targetUserId,
        isbns: [book1.isbn],
        withAuth: true,
      });
    });

    then("the book should not be rented and the user should be notified", () => {
      expect(response.status).not.toBe(201);
    });
  });

  test("Try to rent a book with an invalid ISBN", ({ given, when, then }) => {
    given("an existing user with a valid token", async () => {
      authUser = await createUser();
      token = await generateToken(authUser.userName, authUser.password);
      targetUserId = authUser.userId;
    });

    when("I try to rent a book with an invalid ISBN", async () => {
      response = await rentBooks({
        userId: targetUserId,
        isbns: [invalidIsbn],
        withAuth: true,
      });
    });

    then("the book should not be rented and the user should be notified", () => {
      expect(response.status).not.toBe(201);
    });
  });

  test("Try to rent the same book twice", ({ given, and, when, then }) => {
    given("an existing user with a valid token", async () => {
      authUser = await createUser();
      token = await generateToken(authUser.userName, authUser.password);
      targetUserId = authUser.userId;
    });

    and("the user has already rented a book", async () => {
      availableBooks = await listBooks();
      book1 = availableBooks[0];

      const firstRent = await rentBooks({
        userId: targetUserId,
        isbns: [book1.isbn],
        withAuth: true,
      });

      expect([200, 201]).toContain(firstRent.status);
    });

    when("I try to rent the same book again", async () => {
      response = await rentBooks({
        userId: targetUserId,
        isbns: [book1.isbn],
        withAuth: true,
      });
    });

    then("the book should not be rented and the user should be notified", async () => {
      expect(response.status).not.toBe(201);

      const details = await getUserDetails(targetUserId);
      expect(details.status).toBe(200);

      const rentedIsbns = (details.body.books || []).map((b) => b.isbn);
      const count = rentedIsbns.filter((isbn) => isbn === book1.isbn).length;
      expect(count).toBe(1);
    });
  });

  test("Try to rent two books where one ISBN is invalid", ({ given, and, when, then }) => {
    given("an existing user with a valid token", async () => {
      authUser = await createUser();
      token = await generateToken(authUser.userName, authUser.password);
      targetUserId = authUser.userId;
    });

    and("one valid book and one invalid ISBN", async () => {
      availableBooks = await listBooks();
      book1 = availableBooks[0];
      book2 = { isbn: invalidIsbn };
    });

    when("I try to rent both books", async () => {
      response = await rentBooks({
        userId: targetUserId,
        isbns: [book1.isbn, book2.isbn],
        withAuth: true,
      });
    });

    then("the books should not be rented and the user should be notified", async () => {
      expect(response.status).not.toBe(201);

      const details = await getUserDetails(targetUserId);
      expect(details.status).toBe(200);

      const rentedIsbns = (details.body.books || []).map((b) => b.isbn);
      expect(rentedIsbns).not.toContain(book1.isbn);
    });
  });
});

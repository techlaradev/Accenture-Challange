const { defineFeature, loadFeature } = require("jest-cucumber");
const api = require("../../utils/request");

const feature = loadFeature("src/bdd/features/CreateUser.feature");

defineFeature(feature, (test) => {
  let creds;         
  let createdUserId;  
  let lastCreateRes; 

  const validPassword = "Password123!";

  function uniqueUsername(prefix = "user") {
    return `${prefix}_${Date.now()}`;
  }

  async function createUser(payload) {
    return api.post("/Account/v1/User").send(payload);
  }

  test("Create a user successfully", ({ given, and, then }) => {
    given("a user is created", async () => {
      creds = { userName: uniqueUsername(), password: validPassword };

      const res = await createUser(creds);
      expect(res.status).toBe(201);
      expect(res.body.userID).toBeTruthy();

      createdUserId = res.body.userID;
    });

    and("a token is generated", async () => {
      const res = await api.post("/Account/v1/GenerateToken").send(creds);
      expect(res.status).toBe(200);
      expect(res.body.token).toBeTruthy();
      expect(res.body.status).toBeTruthy();
    });

    and("the user is authorized", async () => {
      const res = await api.post("/Account/v1/Authorized").send(creds);
      expect(res.status).toBe(200);
      expect(res.body).toBe(true);
    });

    then("the user should be able to retrieve their details", async () => {

      const tokenRes = await api.post("/Account/v1/GenerateToken").send(creds);
      const token = tokenRes.body.token;

      const res = await api
        .get(`/Account/v1/User/${createdUserId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.userId || res.body.userID || res.body.username || res.body.userName).toBeDefined();
    });
  });

  // Alternative paths

  test("Try to create a user with invalid credentials", ({ given, when, then }) => {
    given("a user has invalid credentials", () => {
      creds = { userName: uniqueUsername("invalid"), password: "123" };
    });

    when("try create a user", async () => {
      lastCreateRes = await createUser(creds);
    });

    then("the user should not be created and the user should be notified", () => {
      expect(lastCreateRes.status).not.toBe(201);
       expect(lastCreateRes.body).toBeDefined();
    });
  });

  test("Try to create a user with an existing username", ({ given, when, then }) => {
    given("a user has an existing username", async () => {
      creds = { userName: uniqueUsername("dup"), password: validPassword };

      const first = await createUser(creds);
      expect(first.status).toBe(201);
    });

    when("try create a user", async () => {
      lastCreateRes = await createUser(creds);
    });

    then("the user should not be created and the user should be notified", () => {
      expect(lastCreateRes.status).not.toBe(201);
      expect(lastCreateRes.body).toBeDefined();
    });
  });

  test("Try to create a user without username", ({ given, when, then }) => {
    given("a user without username, just password", () => {
      creds = { userName: "", password: validPassword };
    });

    when("try create a user", async () => {
      lastCreateRes = await createUser(creds);
    });

    then("the user should not be created and the user should be notified", () => {
      expect(lastCreateRes.status).not.toBe(201);
      expect(lastCreateRes.body).toBeDefined();
    });
  });

  test("Try to create a user without password", ({ given, when, then }) => {
    given("a user without password, just username", () => {
      creds = { userName: uniqueUsername("nopass"), password: "" };
    });

    when("try create a user", async () => {
      lastCreateRes = await createUser(creds);
    });

    then("the user should not be created and the user should be notified", () => {
      expect(lastCreateRes.status).not.toBe(201);
      expect(lastCreateRes.body).toBeDefined();
    });
  });
});

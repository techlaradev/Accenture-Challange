const { defineFeature, loadFeature } = require("jest-cucumber");
const api = require("../../utils/request");

const feature = loadFeature("src/bdd/features/LoginUser.feature");

defineFeature(feature, (test) => {
  let creds;
  let tokenRes;

  const validPassword = "Password123!";

  function uniqueUsername(prefix = "user") {
    return `${prefix}_${Date.now()}`;
  }

  async function createUser(payload) {
    return api.post("/Account/v1/User").send(payload);
  }

  async function generateToken(payload) {
    return api.post("/Account/v1/GenerateToken").send(payload);
  }

  test("Existing user logs in successfully", ({ given, when, then }) => {
    given("an existing user", async () => {
      creds = { userName: uniqueUsername("login"), password: validPassword };

      const res = await createUser(creds);
      expect(res.status).toBe(201);
      expect(res.body.userID).toBeTruthy();
    });

    when("I generate a token with valid credentials", async () => {
      tokenRes = await generateToken(creds);
    });

    then("a valid token should be returned", () => {
      expect(tokenRes.status).toBe(200);
      expect(tokenRes.body.token).toBeTruthy();
      // geralmente vem "Success", mas não vou amarrar 100%
      expect(tokenRes.body.status).toBeTruthy();
    });
  });

  test("Non-existent user tries to login", ({ given, when, then }) => {
    given("a non-existent user", () => {
      creds = { userName: uniqueUsername("no_user"), password: validPassword };
    });

    when("I generate a token with invalid credentials", async () => {
      tokenRes = await generateToken(creds);
    });

    then("the login should fail and the user should be notified", () => {
      // DemoQA costuma retornar 200 com status Failed e token vazio
      expect(tokenRes.status).toBe(200);
      expect(tokenRes.body.token).toBeFalsy();
      expect(String(tokenRes.body.status).toLowerCase()).toBe("failed");
      expect(tokenRes.body.result).toBeTruthy();
    });
  });

  test("Login without username", ({ given, when, then }) => {
    given("a user without a username", () => {
      creds = { userName: "", password: validPassword };
    });

    when("I try to login", async () => {
      tokenRes = await generateToken(creds);
    });

    then("the login should fail and the user should be notified", () => {
      // pode vir 400 ou 200 Failed, então valida sem travar no status
      expect(tokenRes.status).not.toBe(201);
      expect(tokenRes.body.token).toBeFalsy();
      expect(tokenRes.body).toBeDefined();
    });
  });

  test("Login without password", ({ given, when, then }) => {
    given("a user without a password", () => {
      creds = { userName: uniqueUsername("nopass"), password: "" };
    });

    when("I try to login", async () => {
      tokenRes = await generateToken(creds);
    });

    then("the login should fail and the user should be notified", () => {
      expect(tokenRes.status).not.toBe(201);
      expect(tokenRes.body.token).toBeFalsy();
      expect(tokenRes.body).toBeDefined();
    });
  });
});

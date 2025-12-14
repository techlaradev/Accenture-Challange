const supertest = require("supertest");
require("dotenv").config();

const BASE_URL = process.env.BASE_URL || "https://demoqa.com";
module.exports = supertest(BASE_URL);

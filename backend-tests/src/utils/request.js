import supertest from "supertest";
import "dotenv/config";

if (!process.env.BASE_URL) {
  throw new Error("BASE_URL não configurada. Use o .env.example");
}

export default supertest(process.env.BASE_URL);

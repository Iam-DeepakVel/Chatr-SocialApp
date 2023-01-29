import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";

declare global {
  var signin: () => Promise<string[]>;
}

// * We need to initiate environment variables and mongoMemoryServer before runing test environment
let mongo: any;
// This "beforeAll()" is global declaration comes from jest - so this can be accessed in any file without importing it.
// !Before test
beforeAll(async () => {
  process.env.JWT_SECRET = "fsdfsfsfsfasasg";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  // New instance of MongoMemoryServer
  mongo = await MongoMemoryServer.create();
  let mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

// !To have fresh database everytime we run the unit test - This helps to avoid storing of values in local server and cause of some errors
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// !After test
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = async () => {
  const res = await request(app)
    .post("/signup")
    .send({
      email: "email@email.com",
      password: "123456",
    })
    .expect(201);

  const cookie = res.get("Set-Cookie");
  return cookie;
};

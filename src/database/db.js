import { MongoClient } from "mongodb";

const mongoClient = new MongoClient("mongodb://localhost:27017");

try {
  await mongoClient.connect();
} catch (err) {
  console.log(err);
}

const db = mongoClient.db("myWallet");

export { db };

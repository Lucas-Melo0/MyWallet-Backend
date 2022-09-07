import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import { validateSignUp } from "./validator.js";
import bcrypt from "bcrypt";

const server = express();
server.use(express.json());
server.use(cors());

const mongoClient = new MongoClient("mongodb://localhost:27017");
let db;
mongoClient.connect().then(() => {
  db = mongoClient.db("myWallet");
});

server.post("/sign-up", async (req, res) => {
  const { error } = validateSignUp(req.body);
  const { password, name, email } = req.body;

  if (error) {
    return res.sendStatus(400);
  }

  try {
    const users = await db.collection("users").find().toArray();
    const isDuplicate = users.find(
      (user) => user.name === name || user.email === email
    );

    if (isDuplicate) {
      return res.sendStatus(409);
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    delete req.body.confirmation;
    await db
      .collection("users")
      .insertOne({ ...req.body, password: hashedPassword });

    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
});

server.listen(5000, () => {
  console.log("listen on 5000");
});

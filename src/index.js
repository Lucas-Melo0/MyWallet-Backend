import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";

import { validateSignIn, validateSignUp } from "./validator.js";
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
  } catch (err) {
    res.sendStatus(500);
  }
});

server.post("/sign-in", async (req, res) => {
  const { error } = validateSignIn(req.body);
  const { password, email } = req.body;

  if (error) {
    return res.sendStatus(400);
  }

  try {
    const users = await db.collection("users").find().toArray();
    const isValidUser = users.find(
      (user) =>
        user.email === email && bcrypt.compareSync(password, user.password)
    );

    if (isValidUser) {
      console.log(isValidUser);
      const { _id } = isValidUser;
      const token = uuidv4();
      await db.collection("sessions").insertOne({ userId: _id, token });
      return res.status(200).send({ token });
    }
    return res.sendStatus(404);
  } catch (err) {
    res.sendStatus(500);
  }
});

server.listen(5000, () => {
  console.log("listen on 5000");
});

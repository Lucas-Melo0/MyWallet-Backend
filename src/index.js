import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import {
  validateOperation,
  validateSignIn,
  validateSignUp,
} from "./validator.js";
import bcrypt from "bcrypt";

const server = express();
server.use(express.json());
server.use(cors());

const mongoClient = new MongoClient("mongodb://localhost:27017");
let db;
mongoClient.connect().then(() => {
  db = mongoClient.db("myWallet");
});
const currentDate = () => {
  let date = new Date().toLocaleDateString("pt-br");
  return date.slice(0, 5);
};

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
      const { _id, name } = isValidUser;
      const token = uuidv4();

      await db.collection("sessions").insertOne({ userId: _id, token });
      return res.status(200).send({ name, token });
    }
    return res.sendStatus(404);
  } catch (err) {
    res.sendStatus(500);
  }
});

server.post("/income", async (req, res) => {
  const { authorization } = req.headers;
  const { error } = validateOperation(req.body);
  const token = authorization?.replace("Bearer ", "");

  if (error) return res.sendStatus(400);
  if (!token) return res.sendStatus(401);

  try {
    const session = await db.collection("sessions").findOne({ token });
    const { userId } = session;

    if (!session) return res.sendStatus(401);

    const user = await db.collection("users").findOne({ _id: userId });
    const { name } = user;
    await db.collection("operations").insertOne({
      ...req.body,
      name,
      userId,
      operation: "income",
      date: currentDate(),
    });

    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
});

server.post("/outcome", async (req, res) => {
  const { authorization } = req.headers;
  const { error } = validateOperation(req.body);
  const token = authorization?.replace("Bearer ", "");

  if (error) return res.sendStatus(400);
  if (!token) return res.sendStatus(401);

  try {
    const session = await db.collection("sessions").findOne({ token });
    const { userId } = session;

    if (!session) return res.sendStatus(401);

    const user = await db.collection("users").findOne({ _id: userId });
    const { name } = user;
    await db.collection("operations").insertOne({
      ...req.body,
      name,
      userId,
      operation: "outcome",
      date: currentDate(),
    });

    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
});

server.get("/session", async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);

  try {
    const session = await db.collection("sessions").findOne({ token });

    if (!session) return res.sendStatus(401);

    const { userId } = session;
    const userOperations = await db
      .collection("operations")
      .find({ userId })
      .toArray();

    return res.status(200).send(userOperations);
  } catch (err) {
    return res.sendStatus(500);
  }
});

server.delete("/sign-in", async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);

  try {
    await db.collection("sessions").deleteOne({ token });
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
});

server.delete("/transactions/:id", async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  const { id } = req.params;

  if (!token || !id) return res.sendStatus(401);

  try {
    await db.collection("operations").deleteOne({ _id: ObjectId(id) });
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
});

server.listen(5000, () => {
  console.log("listen on 5000");
});

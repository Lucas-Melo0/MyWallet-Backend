import { validateSignUp, validateSignIn } from "../validator.js";
import { db } from "../database/db.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const userSignup = async (req, res) => {
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
};

const userSignin = async (req, res) => {
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
      await db.collection("sessions").deleteMany({ userId: _id });
      await db.collection("sessions").insertOne({ userId: _id, token });
      return res.status(200).send({ name, token });
    }
    return res.sendStatus(404);
  } catch (err) {
    res.sendStatus(500);
  }
};

const userLogout = async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);

  try {
    await db.collection("sessions").deleteOne({ token });
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export { userSignup, userSignin, userLogout };

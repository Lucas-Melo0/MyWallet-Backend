import { db } from "../database/db.js";
import { ObjectId } from "mongodb";

const currentDate = () => {
  let date = new Date().toLocaleDateString("pt-br");
  return date.slice(0, 5);
};

const incomeTransaction = async (req, res) => {
  const token = res.locals.token;

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
};

const expenseTransaction = async (req, res) => {
  const token = res.locals.token;

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
      operation: "expenses",
      date: currentDate(),
    });

    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
};

const getTransactions = async (req, res) => {
  const token = res.locals.token;
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
};

const removeTransaction = async (req, res) => {
  const { id } = req.params;

  if (!id) return res.sendStatus(401);

  try {
    await db.collection("operations").deleteOne({ _id: ObjectId(id) });
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
};

const editTransaction = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.sendStatus(401);

  try {
    await db
      .collection("operations")
      .updateOne({ _id: ObjectId(id) }, { $set: { description } });
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export {
  incomeTransaction,
  expenseTransaction,
  getTransactions,
  removeTransaction,
  editTransaction,
};

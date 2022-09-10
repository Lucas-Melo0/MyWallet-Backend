import {
  incomeTransaction,
  expenseTransaction,
  getTransactions,
  removeTransaction,
} from "../controllers/transactionsController.js";
import express from "express";

const router = express.Router();

router.post("/income", incomeTransaction);
router.post("/outcome", expenseTransaction);
router.get("/session", getTransactions);
router.delete("/transactions/:id", removeTransaction);

export default router;

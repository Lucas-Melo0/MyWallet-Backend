import {
  incomeTransaction,
  expenseTransaction,
  getTransactions,
  removeTransaction,
  editTransaction,
} from "../controllers/transactionsController.js";
import express from "express";
import { operationValidation } from "../middlewares/operationValidationMiddleware.js";

const router = express.Router();

router.post("/income", operationValidation, incomeTransaction);
router.post("/expenses", operationValidation, expenseTransaction);
router.get("/session", getTransactions);
router.delete("/transactions/:id", removeTransaction);
router.put("/transactions/:id", editTransaction);

export default router;

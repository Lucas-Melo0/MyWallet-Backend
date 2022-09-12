import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRouter from "./routers/usersRouter.js";
import transactionsRouter from "./routers/transactionsRouter.js";
import { hasToken } from "./middlewares/authMiddleware.js";

const server = express();
dotenv.config();
server.use(express.json());
server.use(cors());
server.use(usersRouter);
server.use(hasToken);
server.use(transactionsRouter);

server.listen(process.env.PORT, () => {
  console.log("listen on 5000");
});

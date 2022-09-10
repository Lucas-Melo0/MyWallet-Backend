import express from "express";
import cors from "cors";
import usersRouter from "./routers/usersRouter.js";
import transactionsRouter from "./routers/transactionsRouter.js";
import { hasToken } from "./middlewares/authMiddleware.js";

const server = express();
server.use(express.json());
server.use(cors());
server.use(usersRouter);
server.use(hasToken);
server.use(transactionsRouter);

server.listen(5000, () => {
  console.log("listen on 5000");
});

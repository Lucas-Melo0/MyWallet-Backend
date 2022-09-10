import {
  userSignup,
  userSignin,
  userLogout,
} from "../controllers/usersControllers.js";
import express from "express";

const router = express.Router();

router.post("/sign-up", userSignup);
router.post("/sign-in", userSignin);
router.delete("/sign-in", userLogout);

export default router;

import {
  userSignup,
  userSignin,
  userLogout,
} from "../controllers/usersControllers.js";
import express from "express";
import { signupValidation } from "../middlewares/signupValidationMiddleware.js";
import { signinValidation } from "../middlewares/signinValidationMiddleware.js";

const router = express.Router();

router.post("/sign-up", signupValidation, userSignup);
router.post("/sign-in", signinValidation, userSignin);
router.delete("/sign-in", userLogout);

export default router;

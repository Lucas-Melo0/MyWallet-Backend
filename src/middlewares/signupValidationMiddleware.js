import { validateSignUp } from "../validator.js";
const signupValidation = (req, res, next) => {
  const { error } = validateSignUp(req.body);
  if (error) {
    return res.sendStatus(400);
  }
  next();
};

export { signupValidation };

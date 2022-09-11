import { validateSignIn } from "../validator.js";

const signinValidation = (req, res, next) => {
  const { error } = validateSignIn(req.body);
  if (error) {
    return res.sendStatus(400);
  }
  next();
};

export { signinValidation };

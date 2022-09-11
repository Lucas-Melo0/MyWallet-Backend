import { validateOperation } from "../validator.js";

const operationValidation = (req, res, next) => {
  const { error } = validateOperation(req.body);
  if (error) return res.sendStatus(400);
  next();
};
export { operationValidation };

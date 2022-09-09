import Joi from "joi";

const validator = (schema) => (payload) => schema.validate(payload);

const signUpSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  confirmation: Joi.ref("password"),
});

const signInSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const operationSchema = Joi.object({
  value: Joi.string().required(),
  description: Joi.string().required(),
});

const deleteOperationSchema = Joi.object({
  operationId: Joi.string().required(),
});

const validateSignUp = validator(signUpSchema);
const validateSignIn = validator(signInSchema);
const validateOperation = validator(operationSchema);
const validateDeletion = validator(deleteOperationSchema);

export { validateSignUp, validateSignIn, validateOperation, validateDeletion };

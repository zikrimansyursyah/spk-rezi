const Joi = require("joi");

const loginSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(5).required(),
  is_remember: Joi.boolean().required(),
});
module.exports = {
  loginSchema,
};

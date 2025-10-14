const Joi = require("joi");

const registerUserValidation = Joi.object({
  nama: Joi.string().min(5).max(50).required(),
  username: Joi.string().min(5).max(50).required(),
  password: Joi.string().min(4).required(),
  role: Joi.string().valid("admin", "kasir", "dapur", "resepsionis"),
});

module.exports = { registerUserValidation };

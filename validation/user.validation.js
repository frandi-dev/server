const Joi = require("joi");
const password = require("../utils/password");

const createUserValidation = Joi.object({
  nama: Joi.string().min(5).max(50).required(),
  username: Joi.string().min(5).max(50).required(),
  password: Joi.string().min(4).required(),
  role: Joi.string().valid("admin", "kasir", "dapur", "resepsionis"),
});

const loginUserValidation = Joi.object({
  username: Joi.string().min(5).max(50).required(),
  password: Joi.string().min(5).max(50).required(),
});

module.exports = { createUserValidation, loginUserValidation };

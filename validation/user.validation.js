const Joi = require("joi");

const createUserValidation = Joi.object({
  nama: Joi.string().min(5).max(50).required(),
  username: Joi.string().min(5).max(50).required(),
  password: Joi.string().min(4).max(50).required(),
  role: Joi.string().valid("admin", "kasir", "dapur", "resepsionis"),
});

const loginUserValidation = Joi.object({
  username: Joi.string().max(50).required(),
  password: Joi.string().max(50).required(),
});

const getUserByUsernameValidation = Joi.string().min(5).max(50).required();

const updateUserValidation = Joi.object({
  username: Joi.string().min(5).max(50).required(),
  nama: Joi.string().min(5).max(50).optional(),
  password: Joi.string().min(4).max(50).optional(),
  role: Joi.string().valid("admin", "kasir", "dapur", "resepsionis").optional(),
  is_active: Joi.bool().optional(),
});

module.exports = {
  createUserValidation,
  loginUserValidation,
  getUserByUsernameValidation,
  updateUserValidation,
};

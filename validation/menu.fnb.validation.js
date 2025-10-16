const Joi = require("joi");

const createCategoryValidation = Joi.object({
  nama: Joi.string().required(),
});

const createMenuValidation = Joi.object({
  nama: Joi.string().min(3).max(50).required(),
  harga: Joi.number().integer().required(),
  stok: Joi.number().integer().required(),
});

const searchMenuFnbValidation = Joi.string().required().trim();
const deleteMenuFnbValidation = Joi.number().integer().required();

module.exports = {
  createCategoryValidation,
  createMenuValidation,
  searchMenuFnbValidation,
  deleteMenuFnbValidation,
};

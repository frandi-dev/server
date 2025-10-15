const Joi = require("joi");

const createRoomValidation = Joi.object({
  nama: Joi.string().min(3).max(50).required(),
  kapasitas: Joi.number().integer().required(),
  tarif_per_jam: Joi.number().integer().required(),
  status: Joi.string()
    .valid("tersedia", "terisi", "perawatan")
    .default("tersedia"),
});

const updateRoomValidation = Joi.object({
  id: Joi.number().integer().required(), //harus ada
  nama: Joi.string().min(3).max(50).optional(),
  kapasitas: Joi.number().integer().optional(),
  tarif_per_jam: Joi.number().integer().optional(),
  status: Joi.string()
    .valid("tersedia", "terisi", "perawatan")
    .default("tersedia"),
});

const getRoomNameValidation = Joi.string().min(3).max(50).required();
const idRequiredValidation = Joi.object({
  id: Joi.number().integer().required(),
});
const statusRoomValidation = Joi.object({
  id: Joi.number().integer().required(),
  status: Joi.string()
    .valid("tersedia", "terisi", "perawatan")
    .default("tersedia"),
});

module.exports = {
  createRoomValidation,
  getRoomNameValidation,
  updateRoomValidation,
  idRequiredValidation,
  statusRoomValidation,
};

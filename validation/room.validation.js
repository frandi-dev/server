const Joi = require("joi");

const createRoomValidation = Joi.object({
  nama: Joi.string().min(3).max(50).required(),
  kapasitas: Joi.number().integer().required(),
  tarif_per_jam: Joi.number().integer().required(),
  status: Joi.string()
    .valid("tersedia", "terisi", "perawatan")
    .default("tersedia"),
});

module.exports = { createRoomValidation };

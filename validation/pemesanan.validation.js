const Joi = require("joi");

const ceckInValidation = Joi.object({
  id_ruangan: Joi.number().integer().required(),
  nama: Joi.string().min(3).max(50).required(),
  durasi_menit: Joi.number().required(),
});

const ceckOutValidation = Joi.object({
  id: Joi.number().integer().required(),
  id_user: Joi.number().integer().required(),
  // jumlah_bayar: Joi.number().integer().required(),
  // metode_pembayaran: Joi.string().valid("tunai", "transfer", "qris").required(),
  // catatan: Joi.string(),
});

module.exports = { ceckInValidation, ceckOutValidation };

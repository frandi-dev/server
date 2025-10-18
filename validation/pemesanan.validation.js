const Joi = require("joi");

const ceckInValidation = Joi.object({
  id_ruangan: Joi.number().integer().required(),
  nama: Joi.string().min(3).max(50).required(),
  durasi_menit: Joi.number().required(),
});

const ceckOutValidation = Joi.object({
  id: Joi.number().integer().required(),
  id_user: Joi.number().integer().required(),
  durasi_dipesan_menit: Joi.number().required(),
  total_sewa: Joi.number().integer().required(),
  total_fnb: Joi.number().integer().required(),
  total_tagihan: Joi.number().integer().required(),
  metode_pembayaran: Joi.string().valid("tunai", "transfer", "qris"),
  jumlah_bayar: Joi.number().min(0).required(),
  catatan: Joi.string().allow(null, "").optional(),
});

module.exports = { ceckInValidation, ceckOutValidation };

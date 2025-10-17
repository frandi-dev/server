const validate = require("../validation");
const { ceckInValidation } = require("../validation/pemesanan.validation");
const db = require("../utils/db");
const ResponseError = require("../utils/response.error");

const ceckIn = async (request) => {
  const data = validate(ceckInValidation, request);
  const ruangan = await db.ruangan.findFirst({
    where: {
      id: data.id_ruangan,
    },
    select: {
      nama: true,
      kapasitas: true,
      tarif_per_jam: true,
      status: true,
    },
  });

  // cek ruangan ada / tidak
  if (!ruangan) {
    throw new ResponseError(404, "Room not found");
  }

  // cek status ruangan
  if (ruangan.status !== "tersedia") {
    throw new ResponseError(204, "Room status must be 'tersedia'");
  }

  // gunakan jika mau update ke selesai
  // const durationMs = new Date() - new Date(session.check_in);
  // const durationMinutes = Math.ceil(durationMs / 60000);
  return await db.pemesanan.create({
    data: {
      nama: data.nama,
      id_ruangan: data.id_ruangan,
      waktu_mulai: new Date(),
      durasi_menit: data.durasi_menit,
      status: "aktif",
    },
    select: {
      id_ruangan: true,
      nama: true,
      waktu_mulai: true,
      durasi_menit: true,
      status: true,
    },
  });
};

module.exports = { ceckIn };

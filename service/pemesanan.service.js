const validate = require("../validation");
const { ceckInValidation } = require("../validation/pemesanan.validation");
const db = require("../utils/db");
const ResponseError = require("../utils/response.error");
const formatRupiah = require("../utils/format.idr");

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
  if (ruangan.status === "terisi") {
    throw new ResponseError(204, "Room status must be 'tersedia'");
  }

  // gunakan jika mau update ke selesai
  // const durationMs = new Date() - new Date(session.check_in);
  // const durationMinutes = Math.ceil(durationMs / 60000);
  const create = await db.pemesanan.create({
    data: {
      nama: data.nama,
      id_ruangan: data.id_ruangan,
      waktu_mulai: new Date(),
      durasi_menit: data.durasi_menit,
      status: "aktif",
    },
    include: {
      ruangan: true,
    },
  });

  await db.ruangan.update({
    where: {
      id: data.id_ruangan,
    },
    data: {
      status: "terisi",
    },
  });

  return create;
};

const previewPemesanan = async (request) => {
  const { id } = request;

  // 1. Ambil data pemesanan + ruangan
  const pemesanan = await db.pemesanan.findUnique({
    where: { id: Number(id) },
    include: { ruangan: true },
  });

  if (!pemesanan) {
    throw new ResponseError(404, "Order not found");
  }

  // Ambil waktu mulai & estimasi selesai (berdasarkan durasi_menit)
  const waktuMulai = pemesanan.waktu_mulai;
  const waktuSekarang = new Date();

  const waktuSelesaiEstimasi = new Date(
    waktuMulai.getTime() + pemesanan.durasi_menit * 60000
  );

  // Hitung sisa waktu (menit)
  let sisaMenit = Math.ceil((waktuSelesaiEstimasi - waktuSekarang) / 60000);
  if (sisaMenit < 0) sisaMenit = 0; // jangan negatif

  const sisaJam = (sisaMenit / 60).toFixed(2);

  // Hitung total sewa berdasarkan durasi * tarif/jam
  const durasiJamAsli = pemesanan.durasi_menit / 60;
  const totalSewa = Number(pemesanan.ruangan.tarif_per_jam) * durasiJamAsli;

  // Ambil total F&B
  const totalFnb = await db.detail_pemesanan_fnb.aggregate({
    where: { id_pemesanan: Number(id) },
    _sum: { subtotal: true },
  });

  const biayaTambahan = Number(totalFnb._sum.subtotal || 0);
  const totalTagihan = totalSewa + biayaTambahan;

  return {
    nama_pelanggan: pemesanan.nama,
    nama_ruangan: pemesanan.ruangan.nama,
    waktu_mulai: waktuMulai,
    estimasi_selesai: waktuSelesaiEstimasi,
    waktu_sekarang: waktuSekarang,
    durasi_dipesan_menit: pemesanan.durasi_menit,
    sisa_waktu_menit: sisaMenit,
    sisa_waktu_jam: sisaJam,
    total_sewa: formatRupiah(totalSewa),
    total_fnb: formatRupiah(biayaTambahan),
    total_tagihan: formatRupiah(totalTagihan),
    status: "preview_only",
  };

  // return {
  //   nama_pelanggan: pemesanan.nama,
  //   nama_ruangan: pemesanan.ruangan.nama,
  //   waktu_mulai: pemesanan.waktu_mulai,
  //   waktu_sekarang: waktuSekarang,
  //   durasi_menit: durasiMenit,
  //   durasi_jam: durasiJam.toFixed(2),
  //   total_sewa: totalSewa,
  //   total_fnb: biayaTambahan,
  //   total_tagihan: totalTagihan,
  //   status: "preview_only",
  // };
};

module.exports = { ceckIn, previewPemesanan };

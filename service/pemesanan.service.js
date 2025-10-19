const validate = require("../validation");
const {
  ceckInValidation,
  ceckOutValidation,
  orderFnbValidation,
  updatePesananFnbValidation,
  deletePesananFnbValidation,
} = require("../validation/pemesanan.validation");
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
  // cek status ruangan
  if (ruangan.status === "terisi") {
    throw new ResponseError(204, "Room status must be 'tersedia'");
  }

  // cek ruangan ada / tidak
  if (!ruangan) {
    throw new ResponseError(404, "Room not found");
  }

  if (data.jumlah_orang > ruangan.kapasitas) {
    throw new ResponseError(
      404,
      "The number of people exceeds the room capacity"
    );
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
    id: pemesanan.id,
    nama_pelanggan: pemesanan.nama,
    nama_ruangan: pemesanan.ruangan.nama,
    waktu_mulai: waktuMulai,
    estimasi_selesai: waktuSelesaiEstimasi,
    waktu_sekarang: waktuSekarang,
    durasi_dipesan_menit: pemesanan.durasi_menit,
    sisa_waktu_menit: sisaMenit,
    sisa_waktu_jam: sisaJam,
    total_sewa: totalSewa,
    total_fnb: biayaTambahan,
    total_tagihan: totalTagihan,
  };
};

const ceckOut = async (request) => {
  const {
    id,
    id_user,
    durasi_dipesan_menit,
    total_sewa,
    total_fnb,
    total_tagihan,
    metode_pembayaran,
    jumlah_bayar,
    catatan,
  } = validate(ceckOutValidation, request);

  // ambil id pemesanan + ruangan
  const pemesanan = await db.pemesanan.findFirst({
    where: {
      id,
    },
    include: { ruangan: true },
  });
  // cek apa ada pemesanan
  if (!pemesanan) {
    throw new ResponseError(404, "Order not found");
  }

  //cek status harus aktive
  if (pemesanan.status !== "aktif") {
    throw new ResponseError(400, "Order completed / canceled");
  }

  // hitung kembalian
  if (jumlah_bayar < total_tagihan) {
    throw new ResponseError(400, "The amount paid is less than the total bill");
  }
  const kembalian = jumlah_bayar - total_tagihan;
  const waktu_selesai = new Date();

  // Ambil total F&B
  const totalFnb = await db.detail_pemesanan_fnb.aggregate({
    where: { id_pemesanan: Number(id) },
    _sum: { subtotal: true },
  });

  const biayaTambahan = Number(totalFnb._sum.subtotal || 0);

  const totalTagihan = total_sewa + biayaTambahan;

  //simpan transaksi
  const transaksi = await db.transaksi.create({
    data: {
      id_pemesanan: pemesanan.id,
      id_user: id_user,
      total_sewa: total_sewa,
      biaya_tambahan: total_fnb,
      total_tagihan: totalTagihan,
      jumlah_bayar: jumlah_bayar,
      kembalian: kembalian,
      metode_pembayaran: metode_pembayaran,
      catatan: catatan || "",
      status: "lunas",
    },
    select: {
      status: true,
    },
  });

  // Update pemesanan dan ruangan
  await db.pemesanan.update({
    where: { id: pemesanan.id },
    data: {
      waktu_selesai: waktu_selesai,
      durasi_menit: durasi_dipesan_menit,
      status: "selesai",
    },
  });

  await db.ruangan.update({
    where: {
      id: pemesanan.id_ruangan,
    },
    data: { status: "tersedia" },
  });

  // kirim hasil ke controller
  return {
    nama_pelanggan: pemesanan.nama,
    nama_ruangan: pemesanan.ruangan.nama,
    waktu_mulai: pemesanan.waktu_mulai,
    waktu_selesai: waktu_selesai,
    durasi_dipesan_menit,
    total_sewa,
    biayaTambahan,
    total_tagihan,
    jumlah_bayar,
    kembalian,
    status: transaksi.status,
  };
};

const pemesananFnb = async (request) => {
  const { id_pemesanan, id_menu_fnb, jumlah, id_user } = validate(
    orderFnbValidation,
    request
  );

  // cek pemesanan masih aktive atau tidak
  const pemesanan = await db.pemesanan.findUnique({
    where: {
      id: id_pemesanan,
    },
  });
  if (!pemesanan || pemesanan.status !== "aktif") {
    throw new ResponseError(400, "Order completed / canceled");
  }

  // cek menu fnb
  const menu = await db.menu_fnb.findUnique({
    where: { id: id_menu_fnb },
  });

  // cek menu ada / tidak
  if (!menu) {
    throw new ResponseError(404, "Menu not found");
  }

  if (menu.status !== "tersedia") {
    throw new ResponseError(
      400,
      "The menu you selected is not available or is out of stock "
    );
  }

  if (menu.stok < jumlah) {
    throw new ResponseError(400, "Insufficient stock");
  }

  const subtotal = Number(menu.harga) * jumlah;

  // simpan ke detail pemesanan fnb
  const fnbOrder = await db.detail_pemesanan_fnb.create({
    data: {
      id_pemesanan: id_pemesanan,
      id_menu_fnb: id_menu_fnb,
      jumlah: jumlah,
      subtotal: subtotal,
      id_user: id_user,
    },
    include: {
      menu_fnb: true,
    },
  });

  // update stok pada menu fnb
  await db.menu_fnb.update({
    where: { id: id_menu_fnb },
    data: {
      stok: menu.stok - jumlah,
      status: menu.stok - jumlah > 0 ? "tersedia" : "habis",
    },
  });

  return {
    id_pemesanan: fnbOrder.id_pemesanan,
    nama_menu: fnbOrder.menu_fnb.nama,
    jumlah: fnbOrder.jumlah,
    subtotal: fnbOrder.subtotal,
  };
};

const previewPesananFnb = async (request) => {
  const { id } = request;

  // cek pemesanan
  const pemesanan = await db.pemesanan.findUnique({
    where: { id: Number(id) },
    include: { ruangan: true },
  });

  if (!pemesanan || pemesanan.status !== "aktif") {
    throw new ResponseError(400, "Order completed / canceled");
  }

  // ambil semua pesanan fnb
  const fnbOrder = await db.detail_pemesanan_fnb.findMany({
    where: { id_pemesanan: Number(id) },
    include: {
      menu_fnb: {
        select: {
          nama: true,
          harga: true,
        },
      },
      users: {
        select: { nama: true },
      },
    },
    orderBy: {
      created_at: "asc",
    },
  });

  if (fnbOrder.length === 0) {
    return {
      nama_pelanggan: pemesanan.nama,
      nama_ruangan: pemesanan.ruangan.nama,
      daftar_pesanan: [],
      total_fnb: 0,
    };
  }

  // hitung total harga
  const total_fnb = fnbOrder.reduce(
    (asc, item) => asc + Number(item.subtotal),
    0
  );

  // Bentuk hasil untuk dikirim ke client
  const daftar_pesanan = fnbOrder.map((item) => ({
    id: item.id,
    nama_menu: item.menu_fnb.nama,
    harga_satuan: Number(item.menu_fnb.harga),
    jumlah: item.jumlah,
    subtotal: Number(item.subtotal),
    dipesan: item.users.nama,
  }));

  return {
    nama_pelanggan: pemesanan.nama,
    nama_ruangan: pemesanan.ruangan.nama,
    daftar_pesanan: daftar_pesanan,
    total_fnb: total_fnb,
  };
};

const updatePesananFnb = async (request) => {
  const data = validate(updatePesananFnbValidation, request);

  const detail = await db.detail_pemesanan_fnb.findUnique({
    where: { id: data.id_detail },
    include: { menu_fnb: true },
  });

  if (!detail) {
    throw new ResponseError(404, "Order details not found");
  }

  // cek pemesanan
  const pemesanan = await db.pemesanan.findUnique({
    where: { id: Number(detail.id_pemesanan) },
    include: { ruangan: true },
  });

  if (!pemesanan || pemesanan.status !== "aktif") {
    throw new ResponseError(400, "Order completed / canceled");
  }

  const selisihJumlah = data.jumlah - detail.jumlah; // bisa positif atau negatif

  if (selisihJumlah !== 0) {
    const newStock = detail.menu_fnb.stok - selisihJumlah;
    if (newStock < 0) {
      throw new ResponseError(400, "Insufficient stock to update quantities");
    }

    await db.menu_fnb.update({
      where: {
        id: detail.id_menu_fnb,
      },
      data: {
        stok: newStock,
        status: newStock <= 0 ? "habis" : "tersedia",
      },
    });
  }

  // hitung subtotal baru
  const newSubTotal = Number(detail.menu_fnb.harga) * data.jumlah;

  const update = await db.detail_pemesanan_fnb.update({
    where: { id: data.id_detail },
    data: {
      jumlah: data.jumlah,
      subtotal: newSubTotal,
      id_user: data.id_user,
      updated_at: new Date(),
    },
    include: {
      menu_fnb: { select: { nama: true, harga: true } },
    },
  });

  return {
    nama_menu: update.menu_fnb.nama,
    harga: Number(update.menu_fnb.harga),
    jumlah: update.jumlah,
    subtotal: Number(update.subtotal),
  };
};

const deletePesananFnb = async (request) => {
  const { id_detail } = validate(deletePesananFnbValidation, request);

  const detail = await db.detail_pemesanan_fnb.findUnique({
    where: {
      id: id_detail,
    },
    include: { menu_fnb: true },
  });

  if (!detail) {
    throw new ResponseError(404, "Order not found");
  }

  // cek pemesanan
  const pemesanan = await db.pemesanan.findUnique({
    where: { id: Number(detail.id_pemesanan) },
    include: { ruangan: true },
  });

  if (!pemesanan || pemesanan.status !== "aktif") {
    throw new ResponseError(400, "Order completed / canceled");
  }

  // kembalikan stok menu
  await db.menu_fnb.update({
    where: { id: detail.id_menu_fnb },
    data: {
      stok: { increment: detail.jumlah },
      status: detail.menu_fnb.stok - 1 > 0 ? "tersedia" : "habis",
    },
  });

  // habus detail
  return db.detail_pemesanan_fnb.delete({
    where: {
      id: Number(id_detail),
    },
    select: {
      id: true,
      id_user: true, //untuk kebutuhan kirim ke oner
    },
  });
};

const getPemesananByStatusAktive = async () => {
  const pemesanan = await db.pemesanan.findMany({
    where: {
      status: "aktif",
    },
    select: {
      nama: true,
      id_ruangan: true,
      waktu_mulai: true,
      durasi_menit: true,
      status: true,
    },
  });

  return pemesanan;
};

module.exports = {
  ceckIn,
  previewPemesanan,
  ceckOut,
  pemesananFnb,
  previewPesananFnb,
  updatePesananFnb,
  deletePesananFnb,
  getPemesananByStatusAktive,
};

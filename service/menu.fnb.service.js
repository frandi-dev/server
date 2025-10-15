const db = require("../utils/db");
const ResponseError = require("../utils/response.error");
const validate = require("../validation");
const {
  createCategoryValidation,
  createMenuValidation,
} = require("../validation/menu.fnb.validation");

const createMenuFnb = async (request) => {
  const dataKategori = validate(createCategoryValidation, request.kategori);
  const dataMenu = validate(createMenuValidation, request.menuFnb);

  const data = {};
  // cek nama kategory sudah ada di db
  data.kategori = await db.kategori_menu.count({
    where: {
      nama: dataKategori.nama,
    },
    select: {
      id: true,
      nama: true,
    },
  });

  // jika tidak ada nama kategory di db maka buat baru
  if (!data.kategori) {
    data.kategori = await db.kategori_menu.create({
      data: {
        nama: dataKategori.nama,
      },
    });
  }

  //cek menu fnb di db biar tidak dobel
  data.menuFnb = await db.menu_fnb.count({
    where: {
      nama: dataMenu.nama,
    },
  });

  if (data.menuFnb === 1) {
    throw new ResponseError(400, "Menu f&b already exist");
  }

  const status = dataMenu.stok > 0 ? "tersedia" : "habis";

  return db.menu_fnb.create({
    data: {
      nama: dataMenu.nama,
      id_kategori: data.kategori.id,
      harga: dataMenu.harga,
      stok: dataMenu.stok,
      status: status,
    },
    select: {
      id: true,
      nama: true,
      id_kategori: true,
      harga: true,
      stok: true,
      status: true,
    },
  });
};

module.exports = {
  createMenuFnb,
};

const db = require("../utils/db");
const ResponseError = require("../utils/response.error");
const validate = require("../validation");
const {
  createCategoryValidation,
  createMenuValidation,
  searchMenuFnbValidation,
} = require("../validation/menu.fnb.validation");

/**
 *
 * @param {object} request
 * @returns {object}
 */
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

/**
 * ambil semua data menu
 */
const getAllMenu = async () => {
  const data = await db.kategori_menu.findMany({
    include: {
      menu_fnb: {
        select: {
          id: true,
          nama: true,
          harga: true,
          stok: true,
          status: true,
        },
        orderBy: {
          nama: "asc",
        },
      },
    },
    orderBy: {
      nama: "asc",
    },
  });

  if (!data) {
    throw ResponseError(404, "Menu not found");
  }

  return data;
};

/**
 * fitur cari menuFnb
 */
const searchMenuFnb = async (request) => {
  const query = validate(searchMenuFnbValidation, request);
  const data = {};

  data.search = await db.kategori_menu.findMany({
    where: {
      OR: [{ nama: { contains: query } }],
    },
    include: {
      menu_fnb: {
        select: {
          id: true,
          nama: true,
          harga: true,
          stok: true,
          status: true,
        },
        orderBy: {
          created_at: "desc",
        },
      },
    },
    orderBy: {
      nama: "asc",
    },
  });

  if (data.search.length === 0) {
    data.search = await db.menu_fnb.findMany({
      where: {
        OR: [{ nama: { contains: query } }],
      },
      select: {
        id: true,
        nama: true,
        harga: true,
        stok: true,
        status: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  if (data.search.length === 0) {
    throw new ResponseError(
      404,
      `the keyword you are looking for "${query}" does not exist`
    );
  }

  return data.search;
};

module.exports = {
  createMenuFnb,
  getAllMenu,
  searchMenuFnb,
};

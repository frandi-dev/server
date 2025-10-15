const validate = require("../validation");
const {
  createRoomValidation,
  updateRoomValidation,
} = require("../validation/room.validation");
const db = require("../utils/db");
const ResponseError = require("../utils/response.error");

/**
 * Service untuk membuat room baru
 * @param {Object} request
 * @returns {object}
 */
const createRoom = async (request) => {
  const data = validate(createRoomValidation, request);

  //cek room apa ada di db
  const room = await db.ruangan.count({
    where: {
      nama: data.nama,
    },
  });

  if (room === 1) {
    throw new ResponseError(400, "Room already exist");
  }

  return db.ruangan.create({
    data,
  });
};

const updateRoom = async (request) => {
  const room = validate(updateRoomValidation, request);
  //cek apakah nama room sudah ada
  const isRoom = await db.ruangan.count({
    where: {
      id: room.id,
    },
  });

  if (isRoom !== 1) {
    throw new ResponseError(404, "Room not found");
  }

  //parsing data
  const data = {};

  //cek apa ada fild di dalam request
  if (room.nama) {
    data.nama = room.nama;
  }

  if (room.kapasitas) {
    data.kapasitas = room.kapasitas;
  }

  if (room.tarif_per_jam) {
    data.tarif_per_jam = room.tarif_per_jam;
  }

  if (room.status) {
    data.status = room.status;
  }

  if (!data) {
    throw new ResponseError(404, "Data not fild found for update");
  }

  console.log(data);

  return db.ruangan.update({
    data,
    where: {
      id: room.id,
    },
    select: {
      id: true,
      nama: true,
      kapasitas: true,
      tarif_per_jam: true,
      status: true,
    },
  });
};

module.exports = {
  createRoom,
  updateRoom,
};

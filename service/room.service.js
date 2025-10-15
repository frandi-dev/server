const validate = require("../validation");
const { createRoomValidation } = require("../validation/room.validation");
const db = require("../utils/db");
const ResponseError = require("../utils/response.error");

const createRoom = async (request) => {
  const data = validate(createRoomValidation, request);

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

module.exports = {
  createRoom,
};

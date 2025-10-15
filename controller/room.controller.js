const roomService = require("../service/room.service");

/**
 * [POST] /api/rooms
 * handler untuk membuat room baru
 */
const createRoom = async (req, res, next) => {
  try {
    const result = await roomService.createRoom(req.body);
    res.status(200).json({
      message: "success",
      error: false,
      result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * [PATCH] /api/rooms/:id
 * handler untuk update room
 */
const updateRoom = async (req, res, next) => {
  try {
    const request = {
      id: req.params.id,
      ...req.body,
    };
    const result = await roomService.updateRoom(request);

    res.status(200).json({
      message: "success",
      error: false,
      result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createRoom, updateRoom };

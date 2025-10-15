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

/**
 * [GET] /api/rooms
 * handler untuk get all data room
 */
const getAllRoom = async (req, res, next) => {
  try {
    const result = await roomService.getAllRoom();
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
 * [DELETE] /api/rooms/:id
 * handler untuk delete
 */
const deleteRoom = async (req, res, next) => {
  try {
    await roomService.deleteRoom({
      id: parseInt(req.params.id),
    });
    res.status(200).json({
      message: "success",
      error: false,
      result: {},
    });
  } catch (error) {
    next(error);
  }
};

/**
 * [PATCH] /api/rooms/status/:id
 * handler untuk update room status
 */
const updateStatusRoom = async (req, res, next) => {
  try {
    const result = roomService.updateStatusRoom({
      id: parseInt(req.params.id),
      ...req.body,
    });
    res.status(200).json({
      message: "success",
      error: false,
      result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRoom,
  updateRoom,
  getAllRoom,
  deleteRoom,
  updateStatusRoom,
};

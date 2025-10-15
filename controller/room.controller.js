const roomService = require("../service/room.service");

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

module.exports = { createRoom };

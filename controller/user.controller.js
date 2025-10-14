const userService = require("../service/user.service");

/**
 * [POST] /api/users
 * handler untuk membuat user baru
 */
const createUser = async (req, res, next) => {
  try {
    const result = await userService.createUser(req.body);

    res.status(200).json({
      message: "success",
      error: false,
      result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createUser };

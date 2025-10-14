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

/**
 * [POST] /api/users/login
 * handler untuk login user
 */
const loginUser = async (req, res, next) => {
  try {
    const result = await userService.loginUser(req.body);
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
 * [GET] /api/users/:username
 * handler untuk mengambil 1 data user
 */
const getUserByUsername = async (req, res, next) => {
  try {
    const result = await userService.getUserByUsername(req.params.username);

    res.status(200).json({
      message: "success",
      error: false,
      result,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const request = req.body;
    request.username = req.params.username;
    const result = await userService.updateUser(request);

    res.status(200).json({
      message: "success",
      error: false,
      result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createUser, loginUser, getUserByUsername, updateUser };

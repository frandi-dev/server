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
 * [GET] /api/users/profile
 * handler untuk mengambil profile
 */
const getUserProfile = async (req, res, next) => {
  try {
    const result = await userService.getUserProfile(req.user.username);

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
 * [PATCH] /api/users/:username
 * handler untuk mengambil 1 data user
 */
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

/**
 * [DELETE] /api/users/:username
 * handler untuk mengambil 1 data user
 */
const logoutUser = async (req, res, next) => {
  try {
    const result = await userService.logoutUser(req.user.username);
    res.status(200).json({
      message: "success",
      error: false,
      result: null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * [GET] /api/users
 * handler untuk mengambil semu data user kusus admin
 */
const getAllUser = async (req, res, next) => {
  try {
    const result = await userService.getAllUser();

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
  createUser,
  loginUser,
  getUserProfile,
  updateUser,
  logoutUser,
  getAllUser,
};

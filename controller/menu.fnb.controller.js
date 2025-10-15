const menuFnbService = require("../service/menu.fnb.service");

const createMenuFnb = async (req, res, next) => {
  try {
    const result = await menuFnbService.createMenuFnb(req.body);
    res.status(200).json({
      message: "success",
      error: false,
      result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllMenu = async (req, res, next) => {
  try {
    const result = await menuFnbService.getAllMenu();
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
  createMenuFnb,
  getAllMenu,
};

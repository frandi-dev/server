const menuFnbService = require("../service/menu.fnb.service");

/**
 * handler untuk membuat menu kusus admin
 */
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

/**
 * handler untuk get all
 */
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

/**
 * handler untuk pencarian berdasarkan nama kategory/menu
 */
const searchMenuFnb = async (req, res, next) => {
  try {
    const { query } = req.query;
    const result = await menuFnbService.searchMenuFnb(query);

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
 * handler untuk delete menu by id kusus admin
 */
const deleteMenuFnb = async (req, res, next) => {
  try {
    const result = await menuFnbService.deleteMenuFnb(req.params.id);
    res.status(200).json({
      message: "success",
      error: false,
      result,
    });
  } catch (error) {
    next(error);
  }
};

const updateStokMenu = async (req, res, next) => {
  try {
    const result = await menuFnbService.updateStokMenu({
      id: Number(req.params.id),
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
  createMenuFnb,
  getAllMenu,
  searchMenuFnb,
  deleteMenuFnb,
  updateStokMenu,
};

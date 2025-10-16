const express = require("express");
const route = new express.Router();
const menuFnbController = require("../controller/menu.fnb.controller");
const adminMiddleware = require("../middleware/admin.middleware");

// admin
route.post("/", adminMiddleware, menuFnbController.createMenuFnb);

// all
route.get("/", menuFnbController.getAllMenu);
route.get("/search", menuFnbController.searchMenuFnb);

module.exports = route;

const express = require("express");
const route = new express.Router();
const menuFnbController = require("../controller/menu.fnb.controller");
const adminMiddleware = require("../middleware/admin.middleware");

// admin
route.post("/", adminMiddleware, menuFnbController.createMenuFnb);
route.delete("/:id", adminMiddleware, menuFnbController.deleteMenuFnb);
route.patch("/:id", adminMiddleware, menuFnbController.updateStokMenu);

// all
route.get("/", menuFnbController.getAllMenu);
route.get("/search", menuFnbController.searchMenuFnb);

module.exports = route;

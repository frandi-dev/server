const express = require("express");
const route = new express.Router();
const roomController = require("../controller/room.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

route.use(authMiddleware);
route.post("/", adminMiddleware, roomController.createRoom);
route.patch("/:id", adminMiddleware, roomController.updateRoom);

module.exports = route;

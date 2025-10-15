const express = require("express");
const route = new express.Router();
const roomController = require("../controller/room.controller");
const adminMiddleware = require("../middleware/admin.middleware");

// rute untuk admin
route.post("/", adminMiddleware, roomController.createRoom);
route.patch("/:id", adminMiddleware, roomController.updateRoom);
route.delete("/:id", adminMiddleware, roomController.deleteRoom);

// route untuk semua role
route.get("/", roomController.getAllRoom);
route.patch("/status/:id", roomController.updateStatusRoom);

module.exports = route;

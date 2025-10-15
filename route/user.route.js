const express = require("express");
const route = new express.Router();
const userController = require("../controller/user.controller");
const adminMiddleware = require("../middleware/admin.middleware");

// private router harus membutuhkan Authorization
route.delete("/logout", userController.logoutUser);
route.get("/profile", userController.getUserProfile);

// route kusus admin
route.post("/", adminMiddleware, userController.createUser);
route.patch("/:username", adminMiddleware, userController.updateUser);
route.get("/", adminMiddleware, userController.getAllUser);

module.exports = route;

const express = require("express");
const route = new express.Router();
const userController = require("../controller/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

route.post("/", userController.createUser);
route.post("/login", userController.loginUser);

// private router harus membutuhkan Authorization
route.use(authMiddleware);
route.delete("/logout", userController.logoutUser);
route.get("/profile", userController.getUserProfile);

// route kusus admin
route.patch("/:username", adminMiddleware, userController.updateUser);
route.get("/", adminMiddleware, userController.getAllUser);

module.exports = route;

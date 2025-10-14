const express = require("express");
const route = new express.Router();
const userController = require("../controller/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

route.post("/", userController.createUser);
route.post("/login", userController.loginUser);

// private router harus membutuhkan Authorization
route.use(authMiddleware);
route.patch("/", userController.updateUser);
route.get("/:username", userController.getUserByUsername);

module.exports = route;

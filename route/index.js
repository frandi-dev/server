const express = require("express");
const errorMiddleware = require("../middleware/error.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const userController = require("../controller/user.controller");

const web = express();
web.use(express.json());

web.post("/api/users/login", userController.loginUser);

web.use(authMiddleware);
web.use("/api/users", require("./user.route"));
web.use("/api/rooms", require("./room.route"));

web.use(errorMiddleware);

module.exports = web;

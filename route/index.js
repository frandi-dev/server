const express = require("express");
const errorMiddleware = require("../middleware/error.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const userController = require("../controller/user.controller");

const web = express();
web.use(express.json());
// public
web.post("/api/users/login", userController.loginUser);

// private
web.use(authMiddleware);
web.use("/api/users", require("./user.route"));
web.use("/api/rooms", require("./room.route"));
web.use("/api/fnb", require("./menu.fnb.route"));

web.use(errorMiddleware);

module.exports = web;

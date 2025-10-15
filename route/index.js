const express = require("express");
const errorMiddleware = require("../middleware/error.middleware");

const web = express();
web.use(express.json());

web.use("/api/users", require("./user.route"));
web.use("/api/rooms", require("./room.route"));

web.use(errorMiddleware);

module.exports = web;

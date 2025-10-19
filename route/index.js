const express = require("express");
const errorMiddleware = require("../middleware/error.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const userController = require("../controller/user.controller");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const web = express();
web.use(express.json());
web.use(
  cors({
    origin: "http://localhost:5173",
  })
);
// public
web.post("/api/users/login", userController.loginUser);

const httpServer = createServer(web);

const io = new Server(httpServer, {
  // options
  cors: "*",
});

// hubungkan handler di sini

// private
web.use(authMiddleware);
web.use("/api/users", require("./user.route"));
web.use("/api/rooms", require("./room.route"));
web.use("/api/fnb", require("./menu.fnb.route"));
web.use("/api/pemesanan", require("./pemesanan.route"));

web.use(errorMiddleware);

module.exports = { web, httpServer };

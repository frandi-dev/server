const express = require("express");
const route = new express.Router();
const pemesananController = require("../controller/pemesanan.controller");

// ceckin
route.post("/", pemesananController.ceckIn);

route.get("/preview/:id", pemesananController.previewPemesanan);

module.exports = route;

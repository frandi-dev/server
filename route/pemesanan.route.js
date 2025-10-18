const express = require("express");
const route = new express.Router();
const pemesananController = require("../controller/pemesanan.controller");

// ceckin
route.post("/", pemesananController.ceckIn);

route.get("/preview/:id", pemesananController.previewPemesanan);
route.post("/ceckout", pemesananController.ceckOut);
route.post("/:id/fnb", pemesananController.pemesananFnb);
route.get("/:id/fnb/preview", pemesananController.previewPesananFnb);

module.exports = route;

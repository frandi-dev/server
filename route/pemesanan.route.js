const express = require("express");
const route = new express.Router();
const pemesananController = require("../controller/pemesanan.controller");

// ceckin
route.post("/", pemesananController.ceckIn);
route.get("/", pemesananController.getPemesananByStatusAktive);
route.get("/preview/:id", pemesananController.previewPemesanan);
route.post("/ceckout", pemesananController.ceckOut);
route.post("/:id/fnb", pemesananController.pemesananFnb);
route.get("/:id/fnb/preview", pemesananController.previewPesananFnb);
route.patch("/:id_user/fnb/:id_detail", pemesananController.updatePesananFnb);
route.delete("/:id_detail/fnb", pemesananController.deletePesananFnb);

module.exports = route;

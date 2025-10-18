const pemesananService = require("../service/pemesanan.service");

const ceckIn = async (req, res, next) => {
  try {
    const result = await pemesananService.ceckIn(req.body);
    res.status(200).json({
      message: "success",
      error: false,
      result,
    });
  } catch (error) {
    next(error);
  }
};

const previewPemesanan = async (req, res, next) => {
  try {
    const result = await pemesananService.previewPemesanan({
      id: Number(req.params.id),
    });
    res.status(200).json({
      message: "success",
      error: false,
      result,
    });
  } catch (error) {
    next(error);
  }
};

const ceckOut = async (req, res, next) => {
  try {
    const result = await pemesananService.ceckOut(req.body);
    res.status(200).json({
      message: "success",
      error: false,
      result,
    });
  } catch (error) {
    next(error);
  }
};

const pemesananFnb = async (req, res, next) => {
  try {
    const result = await pemesananService.pemesananFnb({
      id_pemesanan: Number(req.params.id),
      ...req.body,
    });
    res.status(200).json({
      message: "success",
      error: false,
      result,
    });
  } catch (error) {
    next(error);
  }
};

const previewPesananFnb = async (req, res, next) => {
  try {
    const result = await pemesananService.previewPesananFnb({
      id: Number(req.params.id),
    });

    res.status(200).json({
      message: "success",
      error: false,
      result,
    });
  } catch (error) {
    next(error);
  }
};

const updatePesananFnb = async (req, res, next) => {
  try {
    const result = await pemesananService.updatePesananFnb({
      id_user: Number(req.params.id_user),
      id_detail: Number(req.params.id_detail),
      ...req.body,
    });
    res.status(200).json({
      message: "success",
      error: false,
      result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  ceckIn,
  previewPemesanan,
  ceckOut,
  pemesananFnb,
  previewPesananFnb,
  updatePesananFnb,
};

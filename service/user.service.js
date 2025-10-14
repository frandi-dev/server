const validate = require("../validation");
const {
  createUserValidation,
  loginUserValidation,
} = require("../validation/user.validation");
const ResponseError = require("../utils/response.error");
const db = require("../utils/db");
const { hash, compare } = require("../utils/password");
const { generate } = require("../utils/token");
const logger = require("../utils/logger");

/**
 * service untuk membuat user baru
 * @param {object} request
 * @returns {object}
 */
const createUser = async (request) => {
  // validasi fild request body
  const data = validate(createUserValidation, request);
  // cek apakah user sudah terdaftar
  const userCount = await db.users.count({
    where: {
      username: data.username,
    },
  });

  if (userCount === 1) {
    throw new ResponseError(400, "Username already exist");
  }

  // encription pasword agar aman
  data.password = await hash(data.password);

  // memasukkan data ke db
  return db.users.create({
    data,
    select: {
      id: true,
      username: true,
      nama: true,
      role: true,
    },
  });
};

const loginUser = async (request) => {
  const data = validate(loginUserValidation, request);

  //cek apakah akun ada
  const user = await db.users.findUnique({
    where: {
      username: data.username,
    },
    select: {
      username: true,
      password: true,
    },
  });

  // kirim error jika tidak ada akun terdaftar
  if (!user) {
    throw new ResponseError(401, "Username or password wrong");
  }

  // cek apakah password cocok dengan yang di db
  const isPasswordValid = await compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new ResponseError(401, "Username or password wrong");
  }

  // buat access token dan masukkan ke db
  const token = generate();
  return db.users.update({
    data: {
      token,
    },
    where: {
      username: user.username,
    },
    select: {
      token: true,
      username: true,
      role: true,
    },
  });
};

module.exports = { createUser, loginUser };

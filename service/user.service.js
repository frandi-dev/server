const validate = require("../validation");
const {
  createUserValidation,
  loginUserValidation,
  getUserByUsernameValidation,
  updateUserValidation,
} = require("../validation/user.validation");
const ResponseError = require("../utils/response.error");
const db = require("../utils/db");
const { hash, compare } = require("../utils/password");
const { generate } = require("../utils/token");

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

/**
 * service untuk login user
 * @param {object} request
 * @returns {object}
 */
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

/**
 * service untuk mengambil data cuma 1 user dengan username
 * @param {object} request
 * @returns {object}
 */
const getUserByUsername = async (request) => {
  const username = validate(getUserByUsernameValidation, request);
  // cek apa kah data ada di db
  const user = await db.users.findUnique({
    where: {
      username: username,
    },
    select: {
      username: true,
      nama: true,
      role: true,
      is_active: true,
    },
  });

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  return user;
};

/**
 * service untuk update data user
 * @param {object} request
 * @returns {object}
 */
const updateUser = async (request) => {
  const user = validate(updateUserValidation, request);

  // cek berapa user di db
  const totalUser = await db.users.count({
    where: {
      username: user.username,
    },
  });

  // jika tidak ada di db kirim error
  if (totalUser !== 1) {
    throw new ResponseError(404, "User not found");
  }

  const data = {};

  // cek apa ada fild nama
  if (user.nama) {
    data.nama = user.nama;
  }
  // cek apa ada fild password
  if (user.password) {
    data.password = await hash(user.password);
  }
  //cek apa ada fild role
  if (user.role) {
    // dan bila yang di update itu role admin maka tidak boleh
    if (user.role === "admin") {
      throw new ResponseError(403, "It is forbidden to change me admin");
    } else {
      data.role = user.role;
    }
  }
  // cek apa ada fild is active
  if (user.is_active) {
    data.is_active = user.is_active;
  }

  // jika data sudah di isi maka langsung update
  return db.users.update({
    where: {
      username: user.username,
    },
    data: data,
    select: {
      username: true,
      nama: true,
      role: true,
      is_active: true,
    },
  });
};

module.exports = { createUser, loginUser, getUserByUsername, updateUser };

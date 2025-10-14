const validate = require("../validation");
const { registerUserValidation } = require("../validation/user.validation");
const ResponseError = require("../utils/response.error");
const db = require("../utils/db");
const { hash } = require("../utils/password");

const createUser = async (request) => {
  // validasi fild request body
  const data = validate(registerUserValidation, request);
  // cek apakah user sudah terdaftar
  const userCount = await db.users.count({
    where: {
      username: data.username,
    },
  });

  if (userCount === 1) {
    throw new ResponseError(400, "Username already exist.");
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

module.exports = { createUser };

const db = require("../utils/db");
const ResponseError = require("../utils/response.error");

const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.get("Authorization");

    const user = await db.users.findFirst({
      where: {
        token,
      },
      select: {
        role: true,
      },
    });
    if (user.role !== "admin") {
      throw new ResponseError("Can only be accessed by admins");
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = adminMiddleware;

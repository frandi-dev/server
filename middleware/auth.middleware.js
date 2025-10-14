const db = require("../utils/db");

const authMiddleware = async (req, res, next) => {
  const token = req.get("Authorization");
  if (!token) {
    res
      .status(401)
      .json({
        message: "Unauthorized",
        error: true,
        result: null,
      })
      .end();
  } else {
    const user = db.users.findFirst({
      where: {
        token,
      },
    });

    if (!user) {
      res
        .status(401)
        .json({
          message: "Unauthorized",
          error: true,
          result: null,
        })
        .end();
    } else {
      req.user = user;
      next();
    }
  }
};

module.exports = authMiddleware;

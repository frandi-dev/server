const db = require("../utils/db");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.get("Authorization");

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
        error: true,
        result: null,
      });
    }

    const user = await db.users.findFirst({
      where: {
        token,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized - Invalid token",
        error: true,
        result: null,
      });
    }

    // simpan user ke req untuk digunakan di controller
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: true,
      result: null,
    });
  }
};

module.exports = authMiddleware;

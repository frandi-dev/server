const ResponseError = require("../utils/response.error");

const errorMiddleware = async (err, req, res, next) => {
  if (err instanceof ResponseError) {
    res
      .status(err.status)
      .json({
        message: err.message,
        error: true,
        result: null,
      })
      .end();
  } else {
    res
      .status(500)
      .json({
        message: err.message,
        error: true,
        result: null,
      })
      .end();
  }
};

module.exports = errorMiddleware;

const { httpServer } = require("./route");
const logger = require("./utils/logger");
require("dotenv").config();

httpServer.listen(process.env.PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${process.env.PORT}`);
});

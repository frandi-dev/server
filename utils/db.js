const { PrismaClient } = require("../generated/prisma");
const logger = require("./logger");

// conect db dengan prisma
const db = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "warn",
    },
  ],
});

db.$on("info", (e) => logger.info(e));
db.$on("warn", (e) => logger.warn(e));
db.$on("error", (e) => logger.error(e));
db.$on("query", (e) => logger.info(e));

module.exports = db;

const { v4: uuid } = require("uuid");

const generate = () => uuid();

module.exports = { generate };

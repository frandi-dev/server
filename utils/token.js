const { v4: uuid } = require("uuid");

const generate = () => uuid().toString();

module.exports = { generate };

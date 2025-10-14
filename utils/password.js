const bcrypt = require("bcrypt");

const hash = (plain) => {
	return bcrypt.hash(plain, 10);
};

module.exports = {
	...bcrypt,
	hash,
};

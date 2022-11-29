const bycrypt = require("bcryptjs");

const main = async () => {
  console.log(await bycrypt.hash("1234", 12));
};

main();

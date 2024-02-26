const dotenv = require("dotenv");
dotenv.config();

console.log("Starting Porygon!");

const Porygon = require("./structures/discord/Porygon");
const Client = new Porygon();

module.exports = Client;
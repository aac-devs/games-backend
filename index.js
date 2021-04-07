const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`),
});
const Server = require("./server");

const server = new Server();
server.listen();

/* eslint-disable no-console */
const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`),
});
const Server = require('./server');

console.log(process.env.NODE_ENV);
console.log('Entorno:');
console.log('NODE_ENV', process.env.NODE_ENV);
console.log('HOST:', process.env.HOST);
console.log('PORT:', process.env.PORT);
console.log('DB:', process.env.DATABASE_URL);

const server = new Server();
Server.connectDB();
server.listen();

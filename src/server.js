/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./database/db');
const gamesRoute = require('./routes/games.routes');
const populateRoute = require('./routes/populate.routes');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.host = process.env.HOST;
    this.paths = {
      games: '/games',
      populate: '/populate',
    };

    // this.connectDB();
    this.middlewares();
    this.routes();
  }

  static async connectDB() {
    try {
      await sequelize.sync({ force: false });
      console.log('Postgresql database online.');
    } catch (error) {
      console.log(error);
    }
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(morgan('dev'));
    this.app.use(express.json());
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use(this.paths.games, gamesRoute);
    this.app.use(this.paths.populate, populateRoute);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running at ${this.host}:${this.port}`);
    });
  }
}

module.exports = Server;

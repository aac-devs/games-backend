const express = require("express");
const cors = require("cors");
const { sequelize } = require("./database/db");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.host = process.env.HOST;
    this.paths = {
      games: "/games",
      detail: "/games/detail/:id",
    };

    this.connectDB();
    this.middlewares();
  }

  async connectDB() {
    try {
      await sequelize.sync({ force: false });
      console.log("Postgresql database online.");
    } catch (error) {
      console.log(error);
    }
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static("public"));
  }

  routes() {}

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running at ${this.host}:${this.port}`);
    });
  }
}

module.exports = Server;

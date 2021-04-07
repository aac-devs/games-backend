"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    static associate(models) {
      this.belongsToMany(models.genre, { through: "game_genre" });
      this.belongsToMany(models.platform, { through: "game_platform" });
    }
  }
  Game.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      released: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rating: {
        type: DataTypes.REAL,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "game",
    }
  );
  return Game;
};

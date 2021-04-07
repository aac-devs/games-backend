const { v4: uuidv4 } = require("uuid");
const { request, response } = require("express");
const {
  game: Game,
  genre: Genre,
  platform: Platform,
} = require("../database/db");

module.exports = {
  create: async (req = request, res = response, next) => {
    try {
      const { genres, platforms, ...body } = req.body;
      const id = `own-${uuidv4()}`;
      const data = { id, ...body };
      const game = await Game.create(data);
      await genres.map(async (g) => {
        const genre = await Genre.findByPk(g.id);
        await game.addGenre(genre);
      });
      await platforms.map(async (p) => {
        const platform = await Platform.findByPk(p.id);
        await game.addPlatform(platform);
      });
      res.json({
        ok: true,
        id,
        msg: "Videogame created successfully!",
      });
    } catch (error) {
      next(error.message);
    }
  },
  update: async (req = request, res = response, next) => {
    try {
      const {
        params: { id },
        body: { genres, platforms, ...rest },
      } = req;
      const game = await Game.findByPk(id);
      await game.setGenres([]);
      await game.setPlatforms([]);
      const newGame = await game.update(rest);
      await Promise.all(
        genres.map(async (g) => {
          const gnr = await Genre.findByPk(g.id);
          newGame.addGenre(gnr);
        })
      );
      await Promise.all(
        platforms.map(async (p) => {
          const plt = await Platform.findByPk(p.id);
          newGame.addPlatform(plt);
        })
      );
      res.json({
        ok: true,
        id,
        msg: "Videogame updated successfully!",
      });
    } catch (error) {
      next(error.message);
    }
  },
  remove: async (req = request, res = response, next) => {
    try {
      const { id } = req.params;
      await Game.destroy({ where: { id } });
      res.json({
        ok: true,
        msg: "Videogame deleted successfully",
      });
    } catch (error) {
      next(error.message);
    }
  },
};

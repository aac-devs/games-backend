const { request } = require('express');
const { game: Game } = require('../database/db');

module.exports = {
  hasName: (req = request, res, next) => {
    try {
      const { name } = req.body;
      if (!name) {
        throw new Error('Name is required!');
      }
      return next();
    } catch (error) {
      return res.status('500').json(error.message);
    }
  },
  hasRating: (req = request, res, next) => {
    try {
      const { rating } = req.body;
      if (!rating) {
        throw new Error('Rating is required!');
      }
      return next();
    } catch (error) {
      return res.status('500').json(error.message);
    }
  },
  existId: async (req = request, res, next) => {
    try {
      const { id } = req.params;
      const game = await Game.findByPk(id);
      if (!game) {
        throw new Error(`Game Id doesn't exist in database!`);
      }
      return next();
    } catch (error) {
      return res.status('500').json(error.message);
    }
  },
};

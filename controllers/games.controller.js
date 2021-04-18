const { response, request } = require("express");

const {
  searchFromApi,
  searchFromDB,
  getGameFromDatabase,
  getGameFromApi,
  returnGenresPlatforms,
  countGamesFromDB,
} = require("../helpers/games-controller");
const api_rawg = process.env.API_RAWG;
const api_key = process.env.API_KEY_RAWG;

let page = 1,
  pageSize = 0,
  totalGamesFromDB = 0,
  gamesFromDBReaded = 0;

module.exports = {
  search: async (req = request, res = response, next) => {
    try {
      const { name, page: queryPage } = req.query;
      if (queryPage === "1") {
        page = 1;
        pageSize = 0;
        totalGamesFromDB = 0;
        gamesFromDBReaded = 0;
      }
      let gamesToSend = [];
      let dbGames;
      totalGamesFromDB = !totalGamesFromDB
        ? await countGamesFromDB(name)
        : totalGamesFromDB;
      if (gamesFromDBReaded < totalGamesFromDB) {
        dbGames = await searchFromDB(page, name);
        gamesToSend = [...dbGames.data];
        gamesFromDBReaded = gamesFromDBReaded + 10;
      }
      pageSize = !dbGames?.data
        ? (pageSize = 20)
        : dbGames.data.length !== 10
        ? (pageSize = 20 - dbGames.data.length)
        : (pageSize = 10);

      const url = `${api_rawg}/games?page=${page}&key=${api_key}&page_size=${pageSize}${
        name ? `&search=${name}` : ""
      }`;
      const { count, currentPage, nextPage, data } = await searchFromApi(
        url,
        page,
        name
      );
      page++;
      gamesToSend = [...gamesToSend, ...data];
      return res.json({
        ok: true,
        count,
        currentPage,
        nextPage,
        data: gamesToSend,
      });
    } catch (error) {
      next(error.message);
    }
  },

  detail: async (req = request, res = response, next) => {
    try {
      let data = {};
      const { id } = req.params;
      if (id.startsWith("own")) {
        data = await getGameFromDatabase(id);
      } else {
        const url = `${api_rawg}/games/${id}?key=${api_key}`;
        data = await getGameFromApi(id, url);
      }
      res.json({
        ok: true,
        result: data,
      });
    } catch (error) {
      next(error.message);
    }
  },
  genres: async (req, res = response, next) => {
    try {
      const { count, rows: results } = await returnGenresPlatforms("genres");
      res.json({
        ok: true,
        count,
        results,
      });
    } catch (error) {
      next(error.message);
    }
  },
  platforms: async (req, res = response, next) => {
    try {
      const { count, rows: results } = await returnGenresPlatforms("platforms");
      res.json({
        ok: true,
        count,
        results,
      });
    } catch (error) {
      next(error.message);
    }
  },
};

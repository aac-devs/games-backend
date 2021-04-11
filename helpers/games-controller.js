const axios = require("axios");
const {
  game: Game,
  genre: Genre,
  platform: Platform,
} = require("../database/db");
const { Op } = require("sequelize");

const filterIdNameFromObject = (originalArray, pltf = false) => {
  return pltf
    ? originalArray.map((array) => ({
        id: array.platform.id,
        name: array.platform.name,
      }))
    : originalArray.map((array) => ({ id: array.id, name: array.name }));
};

const filterNameImageRatingGenresFromFetch = (games) => {
  return games.map((game) => {
    const { id, name, released, rating, genres: gnrs } = game;
    const image = game?.image || game.background_image;
    const genres = filterIdNameFromObject(gnrs);
    return { id, name, image, released, rating, genres };
  });
};

const getDatafromApi = async (url) => {
  try {
    const {
      data: { count, next, results },
    } = await axios.get(url);
    return {
      count,
      next,
      results,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const searchFromApi = async (url, page, name) => {
  const { results, next, count } = await getDatafromApi(url);
  const nextPage = next ? next.split("=")[2].split("&")[0] : "11";
  return {
    count,
    currentPage: page,
    nextPage,
    data: filterNameImageRatingGenresFromFetch(results),
  };
};

const searchFromDB = async (page, name) => {
  const count = await Game.count({
    where: { name: { [Op.iRegexp]: name ? `${name}` : "" } },
  });
  const data = await Game.findAll({
    where: { name: { [Op.iRegexp]: name ? `${name}` : "" } },
    include: [Genre],
    offset: (page - 1) * 5,
    limit: 5,
  });
  return {
    count,
    currentPage: page,
    nextPage: (page - 5) * 5 < count ? (page * 1 + 1).toString() : null,
    data: filterNameImageRatingGenresFromFetch(data),
  };
};

const countGamesFromDB = async (name) => {
  const count = await Game.count({
    where: { name: { [Op.iRegexp]: name ? `${name}` : "" } },
  });
  return count;
};

const getGameFromDatabase = async (id) => {
  try {
    const game = await Game.findOne({
      where: { id },
      include: [
        { model: Genre, attributes: ["id", "name"] },
        { model: Platform, attributes: ["id", "name"] },
      ],
    });
    const { genres: gnrs, platforms: plts, ...rest } = game.dataValues;
    return {
      ...rest,
      genres: filterIdNameFromObject(gnrs),
      platforms: filterIdNameFromObject(plts),
    };
  } catch (error) {
    return new Error(error.message);
  }
};

const getGameFromApi = async (id, url) => {
  const {
    data: {
      name,
      background_image: image,
      description_raw: description,
      released,
      rating,
      genres: gnrs,
      platforms: plts,
    },
  } = await axios.get(url);
  return {
    id,
    name,
    description,
    image,
    released,
    rating,
    genres: filterIdNameFromObject(gnrs),
    platforms: filterIdNameFromObject(plts, true),
  };
};

const returnGenresPlatforms = async (type) => {
  return type === "genres"
    ? await Genre.findAndCountAll()
    : await Platform.findAndCountAll();
};

module.exports = {
  searchFromApi,
  searchFromDB,
  filterIdNameFromObject,
  getDatafromApi,
  getGameFromDatabase,
  getGameFromApi,
  returnGenresPlatforms,
  filterNameImageRatingGenresFromFetch,
  countGamesFromDB,
};

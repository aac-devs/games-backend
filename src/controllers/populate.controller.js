const axios = require('axios');
const { response } = require('express');
const { genre: Genre, platform: Platform } = require('../database/db');

const apiRawg = process.env.API_RAWG;
const apiKey = process.env.API_KEY_RAWG;

const populateGenres = async () => {
  const url = `${apiRawg}/genres?key=${apiKey}`;
  const {
    data: { results },
  } = await axios.get(url);
  const genres = results.map((result) => ({
    id: result.id,
    name: result.name,
  }));
  await Promise.all(genres.map((genre) => Genre.create(genre)));
};

const populatePlatforms = async () => {
  const url = `${apiRawg}/platforms/lists/parents?key=${apiKey}`;
  const {
    data: { results },
  } = await axios.get(url);
  const platforms = results.map((result) => ({
    id: result.id,
    name: result.name,
  }));
  await Promise.all(platforms.map((platform) => Platform.create(platform)));
};

const populateDatabase = async (req, res = response) => {
  try {
    await populateGenres();
    await populatePlatforms();
    const msg = 'Database populated succesfully';
    return res.status(202).json({
      ok: true,
      msg,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: `Something wen't wrong populating database`,
    });
  }
};

module.exports = {
  populateDatabase,
};

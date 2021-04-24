const { Router } = require('express');
const { populateDatabase } = require('../controllers/populate.controller');

const router = Router();

router.get('/', populateDatabase);

module.exports = router;

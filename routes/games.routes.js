const { Router } = require("express");
const crudController = require("../controllers/crud.controller");
const gamesController = require("../controllers/games.controller");
const validations = require("../middlewares/validations");

const router = Router();

// API ROUTES:
router.get("/", gamesController.search);
router.get("/genres", gamesController.genres);
router.get("/platforms", gamesController.platforms);
router.get("/detail/:id", gamesController.detail);

// DB ROUTES:
router.post(
  "/create",
  [validations.hasName, validations.hasRating],
  crudController.create
);
router.put(
  "/edit/:id",
  [validations.existId, validations.hasName, validations.hasRating],
  crudController.update
);
router.delete("/delete/:id", validations.existId, crudController.remove);

module.exports = router;

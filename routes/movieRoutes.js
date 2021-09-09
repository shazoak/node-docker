const express = require('express');
const movieController = require('../controllers/movieController');
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const isCached = require("../middleware/redisMiddleware");
const isSaved = require("../middleware/mongoMiddleware");



//localhost:3000/api/v1/movies/

router.route("/:movie")
    .get(isCached,isSaved,movieController.getMovieByTitle)

module.exports = router;
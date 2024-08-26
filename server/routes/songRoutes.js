// server/routes/songRoutes.js
const express = require('express');
const { createSong, getSongs, updateSong, deleteSong, getStats,getStatsByGenre } = require('../controllers/songController');
const router = express.Router();

router.route('/').post(createSong).get(getSongs);
router.route('/:id').put(updateSong).delete(deleteSong);
router.route('/stats').get(getStats);
router.route('/genre').get(getStatsByGenre);
module.exports = router;

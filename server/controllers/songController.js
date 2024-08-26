// server/controllers/songController.js
const Song = require('../models/songModel');

// @desc    Create a new song
const createSong = async (req, res) => {
  const { title, artist, album, genre } = req.body;
  const song = Song({ title, artist, album, genre });
  await song.save();
  res.status(201).json(song);
};

// @desc    Get all songs
const getSongs = async (req, res) => {
  const songs = await Song.find({});
  res.status(200).json(songs);
};

// @desc    Update a song
const updateSong = async (req, res) => {
  try {
    const updatedSong = await Song.findByIdAndUpdate(
      req.params.id,
      req.body, // New data to update
      { new: true, runValidators: true } // Options: return the new document and validate
    );
    if (!updatedSong) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.status(200).json(updatedSong);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a song
const deleteSong = async (req, res) => {
  try {
    const result = await Song.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.status(200).json({ message: 'Song deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc Get statistics
const getStats = async (req, res) => {
  try {
    const totalSongs = await Song.countDocuments();
    const totalArtists = (await Song.distinct('artist')).length;
    const totalAlbums = (await Song.distinct('album')).length;
    const totalGenres = (await Song.distinct('genre')).length;

    // Additional stats can be added here

    res.status(200).json({ totalSongs, totalArtists, totalAlbums, totalGenres });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
};

// @desc Get statistics by genre
const getStatsByGenre = async (req, res) => {
  try {
    // Aggregate songs by genre to get count per genre
    const genreCounts = await Song.aggregate([
      {
        $group: {
          _id: '$genre',
          count: { $sum: 1 }
        }
      }
    ]);

    // Initialize counts for specific genres
    const genreStats = {
      Pop: 0,
      Rock: 0,
      Ambasel: 0,
      Anchiwoye: 0,
      Jazz: 0,
      Classical: 0,
      Electronic: 0,
      Country: 0,
      Reggae: 0,
      Blues: 0,
      Metal: 0,
      Other: 0
    };

    // Map the aggregated genre counts to the specific genres
    genreCounts.forEach(genre => {
      if (genre._id in genreStats) {
        genreStats[genre._id] = genre.count;
      } else {
        genreStats.Other += genre.count; // Sum up all other genres
      }
    });

    // Optionally: If there are no "Other" genres, set it to 0
    genreStats.Other = genreStats.Other || 0;

    res.status(200).json(genreStats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
};




module.exports = { createSong, getSongs, updateSong, deleteSong, getStats,getStatsByGenre };

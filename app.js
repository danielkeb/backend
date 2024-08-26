// server/server.js
const express = require('express');
const cors= require('cors');
const dotenv = require('dotenv');
const connectDB = require('./server/config/db');
const songRoutes = require('./server/routes/songRoutes');

dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/songs', songRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

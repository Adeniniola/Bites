// server.js
const express = require('express');
const fetch = require('node-fetch'); // npm install node-fetch@2
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.static('.')); // serve frontend files

// Load movies.json
let movies = JSON.parse(fs.readFileSync('movies.json', 'utf-8'));

// Movies API
app.get('/movies', (req, res) => {
  res.json(movies);
});

// Proxy Download route
function driveDirectUrl(fileId) {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

app.get('/download/:id', async (req, res) => {
  try {
    const movie = movies.find(m => m.id === parseInt(req.params.id));
    if (!movie) return res.status(404).send("Movie not found");

    const filename = req.query.name ? req.query.name : `${movie.title}.mp4`;
    const driveUrl = driveDirectUrl(movie.fileId);

    const upstream = await fetch(driveUrl);

    if (!upstream.ok) {
      return res.status(upstream.status).send(`Upstream error: ${upstream.statusText}`);
    }

    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(filename)}"`);
    upstream.body.pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Start server
app.listen(3000, () => {
  console.log("Bites running at http://localhost:3000");
});
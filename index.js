const express = require('express');
const { google } = require('googleapis');
const mongoose = require('mongoose');

const app = express();

const FuzzySet = require('fuzzyset');

// Connect to MongoDB
mongoose.connect('mongodb+srv://<username>:<password>@swetacluster.jdyv5bg.mongodb.net/<database_name>?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define Video schema
const videoSchema = new mongoose.Schema({
  videoId: String,
  title: String,
  description: String,
  publishedAt: Date,
});
const Video = mongoose.model('Video', videoSchema);

// Set up YouTube Data API
const youtubeApiKey = '<youtube data api key>';
const youtube = google.youtube({
  version: 'v3',
  auth: youtubeApiKey,
});

// Retrieve and store videos in the database
async function retrieveAndStoreVideos() {
  const searchResponse = await youtube.search.list({
    q: 'Apple',
    type: 'video',
    part: 'id,snippet',
    maxResults: 50,
  });

  const videos = searchResponse.data.items.map((item) => {
    const videoId = item.id.videoId;
    const title = item.snippet.title;
    const description = item.snippet.description;
    const publishedAt = item.snippet.publishedAt;

    return {
      videoId,
      title,
      description,
      publishedAt,
    };
  });

  await Video.insertMany(videos);
  console.log('Videos stored in the database');
}

// Retrieve and store videos on server startup
retrieveAndStoreVideos();

// API endpoint to search videos by name


//without including fuzzy approach

app.get('/videos', async (req, res) => {
    const query = req.query.query;
  
    // Fuzzy search algorithm can be implemented here
  
    const videos = await Video.find({ title: { $regex: new RegExp(query, 'i') } });
  
    res.json(videos);
  });


// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

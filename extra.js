
//WITH FUZZY APPROACH(some error)
/*
app.get('/videos', async (req, res) => {
    const query = req.query.query;
  
    // Perform fuzzy search
    const fuzzy = FuzzySet();
    const videos = await Video.find({});
  
    videos.forEach((video) => {
      fuzzy.add(video.title);
    });
  
    const matches = fuzzy.get(query, null, 0.5);
  
    // Retrieve matched videos from the database
    const matchedVideos = await Video.find({ title: { $in: matches.map((match) => match[1]) } });
  
    res.json(matchedVideos);
  });
  */




  //WITH FUZZY APPROACH
  app.get('/videos', async (req, res) => {
    const query = req.query.query;
  
    // Perform fuzzy search
    const fuzzy = FuzzySet();
    const videos = await Video.find({});
  
    videos.forEach((video) => {
      fuzzy.add(video.title);
    });
  
    const matches = fuzzy.get(query, null, 0.5);
  
    // Retrieve matched videos from the database
    let matchedVideos;
    if (matches) {
      matchedVideos = await Video.find({ title: { $in: matches.map((match) => match[1]) } });
    } else {
      matchedVideos = [];
    }
  
    res.json(matchedVideos);
  });
  
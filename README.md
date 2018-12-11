# liri-node-app
                         Node app

### Overview of the application -
* This is an user interactive nodejs application that takes user input from CLI and returns appropriate result.
* There are 3 api calls made depending on user search. Below are the three api end points from which data is pulled 
     - spotify API - search for track
     - bands in town API - search for artist
     - omdb API - search for movie

* Two inputs are taken by the application 
   1. task to-do
   2. search parameter for task


* Below are the tasks -

    1.spotify-this-song '<song name here>' - spotify API is called and the following information is logged - 
     - Artist(s)
     - The song's name
     - A preview link of the song from Spotify
     - The album that the song is from

    2.movie-this '<movie name here>' - omdb API is called and the following information is called -
Title of the movie.
   * Year the movie came out.
   * IMDB Rating of the movie.
   * Rotten Tomatoes Rating of the movie.
   * Country where the movie was produced.
   * Language of the movie.
   * Plot of the movie.
   * Actors in the movie.

3.concert-this <artist/band name here> - bands in town api is called and the following information is logged 
       * Name of the venue
       * Venue location
       * Date of the Event 

4.do-what-it-says - reads text file and logs info based on search criteria from text file



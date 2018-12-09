require("dotenv").config();
console.log(process.argv);
console.log("User Name - " ,process.env.USERNAME);
console.log("User Name - " ,process.env.SPOTIFY_ID);
console.log("User Name - " ,process.env.SPOTIFY_SECRET);

var getTask = process.argv[2];
var getSearch = process.argv[3];

var getSpotifyKey = require("./key.js");
var axios = require("axios");
var request = require("request");


var fs = require("fs");
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
  id: getSpotifyKey.spotify.id,
  secret: getSpotifyKey.spotify.secret
});

console.log("getTask-",getTask + "getSearch-",getSearch);
//console.log(getKey.spotify.id)
switch (getTask){
    case "spotify-this-song":
        callSpotifyAPI(getSearch);
        break;
//    case "concert-this":
//        callBandsInTownAPI(getSearch);
//        break;
    case "movie-this":
        callimdbAPI(getSearch);
        break;
    //case "do-what-it-says":
        
}
        

function callSpotifyAPI(searchqry){
    spotify.search({
    type: "track",
    query : "Ace of Base The Sign",
    limit : 1
    
}).then(function(res){
    //console.log(res.tracks.items[0].artists[0].name);
//    console.log(res.tracks.items[0].artists);
    console.log("search query -",res.tracks.href)
    var getItems = res.tracks.items;
   // console.log(res.tracks.items[0].album);
   // console.log(res.tracks.items)
    //Artist name
//    console.log("Artist:",res.tracks.items[8].artists[0].name);
//    //Song preview 
//    console.log("Preview URL",res.tracks.items[8].preview_url)
//    //Song name 
//    console.log("Song Name:",res.tracks.items[8].name)
//    //Album name 
//    console.log("Album:",res.tracks.items[8].album.name)
    
    for(i=0;i<getItems.length;i++){
        console.log(getItems[i].artists[0].name)
        if(getItems[i].artists[0].name == "Ace of Base"){
            console.log("i-" + i, getItems[i].artists[0].name);
             //Artist name
            console.log("Artist:",getItems[i].artists[0].name);
            //Song preview 
            console.log("Preview URL",getItems[i].preview_url)
            //Song name 
            console.log("Song Name:",getItems[i].name)
            //Album name 
            console.log("Album:",getItems[i].album.name)
        }
        
        
    }
})
    
}


function callimdbAPI(searchqry){
    var splitQry = searchqry.split(" ");
    var movieQry;
    for(i=0;i<splitQry.length;i++) {
     if(i !=splitQry.length-1){   
         movieQry += splitQry[i] + "+";
     } else {
         movieQry += splitQry[i]
     };
    }
    
    request.get("http://www.omdbapi.com/?t=" + movieQry + "&plot=short&apikey=trilogy").then(
      function(response) {
        console.log(response.data.Title);
        console.log(response.data.Year);
        console.log(response.data.imdbRating);
      }
);
    
}

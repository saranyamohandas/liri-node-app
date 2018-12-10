require("dotenv").config();
console.log(process.argv);
console.log("User Name - " ,process.env.USERNAME);
console.log("User Name - " ,process.env.SPOTIFY_ID);
console.log("User Name - " ,process.env.SPOTIFY_SECRET);

var getTask = process.argv[2];
var getSearch = process.argv;
//var movieQry = "";


var getSpotifyKey = require("./key.js");
//var axios = require("axios");
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
        console.log("callSpotifyAPI")
        callSpotifyAPI(getSearch);
        
        break;
//    case "concert-this":
//        callBandsInTownAPI(getSearch);
//        break;
    case "movie-this":
        callomdbAPI(getSearch);
        break;
    //case "do-what-it-says":
        
}
        

function callSpotifyAPI(searchqry){
    var trackQry = "";
    var trackMatch = false;
    for(i=3;i<searchqry.length;i++){
        if(i != searchqry.length-1){   
             trackQry += searchqry[i] + " ";
             //console.log(movieQry);
         } else {
             trackQry += searchqry[i]
             //console.log("else", movieQry);
         };
    };
    console.log("trackQry-" ,trackQry);
    
    spotify.search({
    type: "track",
    query : trackQry
    //limit : 1
    
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
       // console.log(getItems);
    //console.log("i-" + i, getItems[i].artists[0].name);
             //Artist name
//            console.log("Artist:",getItems[0].artists[0].name);
//            //Song preview 
//            console.log("Preview URL",getItems[0].preview_url)
//            //Song name 
//            console.log("Song Name:",getItems[0].name)
//            //Album name 
//            console.log("Album:",getItems[0].album.name)
    for(i=0;i<getItems.length;i++){
        //console.log("len-",getItems.length)
        //console.log(getItems[i].name.toLowerCase());
        //console.log(trackQry.toLowerCase());
        if(getItems[i].name.toLowerCase() == trackQry.toLowerCase()){
            console.log("i-" + i, getItems[i].artists[0].name);
             //Artist name
            console.log("Artist:",getItems[i].artists[0].name);
            //Song preview 
            console.log("Preview URL",getItems[i].preview_url)
            //Song name 
            console.log("Song Name:",getItems[i].name)
            //Album name 
            console.log("Album:",getItems[i].album.name)
            //trackMatch = true;
            //console.log(i);
            break;
        }
        
        
    }
})
    
}


function callomdbAPI(searchqry){
   // var splitQry = searchqry.split(" ");
    var movieQry = "";
    for(i=3;i<searchqry.length;i++){
        if(i != searchqry.length-1){   
             movieQry += searchqry[i] + "+";
             //console.log(movieQry);
         } else {
             movieQry += searchqry[i]
             //console.log("else", movieQry);
         };
    };
    
request("http://www.omdbapi.com/?t=" +movieQry+ "&plot=short&apikey=trilogy", function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
 // console.log(body); // Print the HTML for the Google homepage.
    var parseBody = JSON.parse(body);
    var rottenRatings = "";
  //console.log(response)
  console.log("Title-" ,parseBody.Title);
  console.log("Year-" ,parseBody.Year);
    console.log("Country-" ,parseBody.Country);
    console.log("Language-" ,parseBody.Language);
    console.log("Actors-" ,parseBody.Actors);
  console.log("imdbRating-" ,parseBody["imdbRating"]);
  console.log("Plot-" ,parseBody.Plot);
    for(i=0;i<parseBody.Ratings.length;i++){
        if(parseBody.Ratings[i].Source == "Rotten Tomatoes") {
            rottenRatings = parseBody.Ratings;
        }
    }
    if(rottenRatings){
        console.log("Rotten Tomatoes-",parseBody.Ratings);
    } else {
        console.log("Rotten Tomatoes- No ratings found");
    }
    
    
    
  
});
    
}

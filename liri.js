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
var moment = require("moment");


var fs = require("fs");
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
  id: getSpotifyKey.spotify.id,
  secret: getSpotifyKey.spotify.secret
});

console.log("getTask-",getTask + "getSearch-",getSearch);
//get user input and call appropriate functionality
switch (getTask){
    case "spotify-this-song":
        console.log("callSpotifyAPI")
        callSpotifyAPI(getSearch);
        
        break;
    case "concert-this":
        callBandsInTownAPI(getSearch);
        break;
    case "movie-this":
        callomdbAPI(getSearch);
        break;
    //case "do-what-it-says":
        
}
        
// Spotify API functionality
function callSpotifyAPI(searchqry){
    var trackQry = "";
    var trackMatch = false;
    if(!searchqry[3]){
        trackQry = "Mr. Nobody";
    } else {
        for(i=3;i<searchqry.length;i++){
        if(i != searchqry.length-1){   
             trackQry += searchqry[i] + " ";
             //console.log(movieQry);
         } else {
             trackQry += searchqry[i]
             //console.log("else", movieQry);
         };
    };
        
    }
    
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

    for(i=0;i<getItems.length;i++){
        
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

// Bands in town API functionality
function callBandsInTownAPI(searchqry){
    var artistQry = "";
    for(i=3;i<searchqry.length;i++){
        if(i != searchqry.length-1){   
             artistQry += searchqry[i] + " ";
             //console.log(movieQry);
         } else {
             artistQry += searchqry[i]
             //console.log("else", movieQry);
         };
    };
    
request("https://rest.bandsintown.com/artists/" + artistQry + "/events?app_id=codingbootcamp", function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
 // console.log(body); // Print the HTML for the Google homepage.
     var concertRes = JSON.parse(body);
    console.log(concertRes.length)
    
    console.log("Name of the venue : ",concertRes[0].venue.name);
    console.log("Venue location : ",concertRes[0].venue.city + "," +  concertRes[0].venue.region +","+ concertRes[0].venue.country );
    console.log("Date of the Event : " , moment(concertRes[0].datetime).format("L"));
//     console.log("Name of the venue : ",body.name);
//     console.log("Name of the venue : ",body.name);
  
    
});
    
}




//Omdb API functionality
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
            rottenRatings = parseBody.Ratings[i].Value;
            break;
        }
    }
   
    if(rottenRatings){
        console.log("Rotten Tomatoes-",rottenRatings);
    } else {
        console.log("Rotten Tomatoes- No ratings found");
    }
});
    
}

// import dependent modules
require("dotenv").config();
var getSpotifyKey = require("./key.js");
var request = require("request");
var moment = require("moment");
var fs = require("fs");
var Spotify = require('node-spotify-api');

// declare variables
var getTask = process.argv[2];
var getSearch = process.argv.slice(3);
var randomTask = false;
var randomQry = "";
// get spotify id and secret key
var spotify = new Spotify({
  id: getSpotifyKey.spotify.id,
  secret: getSpotifyKey.spotify.secret
});


//validate user input and call appropriate functionality
function callAPI(checkTask){
    
    switch (checkTask){
    case "spotify-this-song":
        console.log("*****Spotify API called*****");
        callSpotifyAPI(getSearch);
        break;
    case "concert-this":
        console.log("*****Bands in Town API called*****");
        callBandsInTownAPI(getSearch);
        break;
    case "movie-this":
        console.log("******Omdb API called******");
        callomdbAPI(getSearch);
        break;
    case "do-what-it-says":
        console.log("*****do-what-it-says******");
        callRandom(getSearch);
        break;
    }
    
}

        
// Spotify API functionality
function callSpotifyAPI(searchqry){
    var trackQry = searchqry.join(" ");
    
    if(!trackQry && !randomTask){
        trackQry = "The Sign";
    } else if(randomTask){
        trackQry = randomQry;    
    } 
    
    
    
    spotify.search({
    type: "track",
    query : trackQry
    
    }).then(function(res){
    
    var getItems = res.tracks.items;
    
    for(i=0;i<getItems.length;i++){
        
        if(getItems[i].name.toLowerCase() == trackQry.toLowerCase()){
            
             //Artist name
            console.log("**************************************");
            console.log("Artist:",getItems[i].artists[0].name);
            //Song preview 
            console.log("Preview URL:",getItems[i].preview_url)
            //Song name 
            console.log("Song Name:",getItems[i].name)
            //Album name 
            console.log("Album:",getItems[i].album.name)
            console.log("**************************************");  
            break;
        }
        
        
    }
})
    
}

// Bands in town API functionality
function callBandsInTownAPI(searchqry){
    

    var artistQry = searchqry.join(" ");
    if(artistQry){
        //build string
       
        artistQry = searchqry.join(" ");
        // API call using request   
        request("https://rest.bandsintown.com/artists/" + artistQry + "/events?app_id=codingbootcamp", function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
 
            var concertRes = JSON.parse(body);
            
            console.log("********************************************")
            console.log("Name of the venue : ",concertRes[0].venue.name);
            console.log("Venue location : ",concertRes[0].venue.city + "," +  concertRes[0].venue.region +","+ concertRes[0].venue.country );
            console.log("Date of the Event : " , moment(concertRes[0].datetime).format("L"));
            console.log("********************************************")
        });
        
    } else {
        console.log("Please enter an Artist for search!!");
    }
}




//Omdb API functionality
function callomdbAPI(searchqry){
   
    var movieQry = searchqry.join("+");
    
    //if no movie is mentioned default to Mr.Nobody
    if(!movieQry){ 
        movieQry = "Mr.Nobody";
    } 
    
// API call using request   
request("http://www.omdbapi.com/?t=" +movieQry+ "&plot=short&apikey=trilogy", function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
 
    var parseBody = JSON.parse(body);
    var rottenRatings = "";
    console.log("*************************************************");
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
        console.log("*************************************************");
    } else {
        console.log("Rotten Tomatoes- No ratings found");
    }
});
}

function callRandom(){
    fs.readFile("random.txt","utf8",function(err,data){
            if(err){
                return console.log(err)
            }
            var getData = data.split(",");
            
            randomTask = true;
            randomQry = getData[1].replace(/"([^"]+(?="))"/g, '$1');
            callAPI(getData[0]);
    })
}


// build search string for track/bands search

//call API check functionality
if(getTask){
    callAPI(getTask);
}
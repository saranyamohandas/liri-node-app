require("dotenv").config();
console.log(process.argv);
console.log("User Name - " ,process.env.USERNAME);
console.log("User Name - " ,process.env.SPOTIFY_ID);
console.log("User Name - " ,process.env.SPOTIFY_SECRET);



// import dependent modules
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

console.log("getTask-",getTask + "getSearch-",getSearch);

//validate user input and call appropriate functionality
function callAPI(checkTask){
    
    switch (checkTask){
    case "spotify-this-song":
        console.log("Spotify API called");
        callSpotifyAPI(getSearch);
        break;
    case "concert-this":
        console.log("Bans in Town API called");
        callBandsInTownAPI(getSearch);
        break;
    case "movie-this":
        console.log("Omdb API called");
        callomdbAPI(getSearch);
        break;
    case "do-what-it-says":
        callRandom(getSearch);
    }
    
}

        
// Spotify API functionality
function callSpotifyAPI(searchqry){
    var trackQry = "";
    
    if(!searchqry && !randomTask){
        trackQry = "The Sign";
    } else if(randomTask){
        trackQry = randomQry;    
    } else {
        trackQry = searchqry.join(" ")
    
    }
    
    console.log("trackQry-" ,trackQry);
    
    spotify.search({
    type: "track",
    query : trackQry
    
    }).then(function(res){
    
    var getItems = res.tracks.items;

    for(i=0;i<getItems.length;i++){
        
        if(getItems[i].name.toLowerCase() == trackQry.toLowerCase()){
            //console.log("i-" + i, getItems[i].artists[0].name);
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
            //trackMatch = true;
            //console.log(i);
            break;
        }
        
        
    }
})
    
}

// Bands in town API functionality
function callBandsInTownAPI(searchqry){
    
    if(!searchqry){
        //artistQry = ""; //check requirement
        console.log("Please enter an Artist for search!!")
    } else {
        //build string
        artistQry = searchqry.join(" ");
        // API call using request   
        request("https://rest.bandsintown.com/artists/" + artistQry + "/events?app_id=codingbootcamp", function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
 
            var concertRes = JSON.parse(body);
            console.log(concertRes.length)

            console.log("Name of the venue : ",concertRes[0].venue.name);
            console.log("Venue location : ",concertRes[0].venue.city + "," +  concertRes[0].venue.region +","+ concertRes[0].venue.country );
            console.log("Date of the Event : " , moment(concertRes[0].datetime).format("L"));
        });
    }
}




//Omdb API functionality
function callomdbAPI(searchqry){
   // var splitQry = searchqry.split(" ");
    var movieQry = "";
    
    //if no movie is mentioned default to Mr.Nobody
    if(!searchqry[3]){ 
        movieQry = "Mr.Nobody";
    } else { //build search string for movie
        for(i=3;i<searchqry.length;i++){
        if(i != searchqry.length-1){   
             movieQry += searchqry[i] + "+";
             //console.log(movieQry);
         } else {
             movieQry += searchqry[i]
             
         };
        };
    }
    
// API call using request   
request("http://www.omdbapi.com/?t=" +movieQry+ "&plot=short&apikey=trilogy", function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
 
    var parseBody = JSON.parse(body);
    var rottenRatings = "";

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

function callRandom(){
    fs.readFile("random.txt","uft8",function(err,data){
            if(err){
                return console.log(err)
            }
            var getData = data.split(",");
            randomTask = true;
            randomQry = getData[1];
            callAPI(getData[0]);
    })
}


// build search string for track/bands search
function buildQry(arr){
    var resQry = "";
    for(i=3;i<arr.length;i++){
        if(i != arr.length-1){   
             resQry += arr[i] + " ";
             //console.log(movieQry);
         } else {
             resQry += arr[i];
             //console.log("else", movieQry);
         };
    };
    return resQry;
    
}
//call API check functionality
if(getTask){
    callAPI(getTask);
}
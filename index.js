var request = require('request');
var MongoClient = require('mongodb').MongoClient;
var api_key = require('./config.json').key;

console.log(api_key);

MongoClient.connect('mongodb://localhost:27017/tmpusr', function(err, db) {
    if (err) {
        throw err;
    }
    var MAX = 487749; // TODO Replace with ajax call from tmdb 
    console.log("Started at: " + new Date().toISOString());
    console.log("This application will log information whenever 1000 movies were processed");
    console.log("Still ned " + MAX + " Movies to process, estimated time: ~" + MAX/240 + " minutes\n");
    (function myLoop (i) {          
        setTimeout(function () {   
    
        var url = "https://api.themoviedb.org/3/movie/" + i + "?api_key=" + api_key + "&append_to_response=videos";
            request(url, function (error, response, body) {
                if (error) {
                    console.log('Lost internet connection, last successful id was: ' + (i-1));
                    console.log('Retrying in 10 seconds');
                    setTimeout(function() {myLoop(i)}, 10000);
                }
                else {
                    db.collection('tmdb').insertOne(JSON.parse(body));
                    if (i % 1000 == 0) {
                        console.log(new Date().toISOString());
                        console.log("processed " + i + " movies, still " + (MAX - i) + " to go, estimated time: ~" + (MAX-i)/240 + " minutes\n");
                    }
                    if (++i < MAX) 
                        myLoop(i);      //  increment i and call myLoop again if i < MAX
                }
            });                        
       }, 250)
    })(0); 
});

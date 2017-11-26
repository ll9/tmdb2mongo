var request = require('request');
var rp = require('request-promise');
var MongoClient = require('mongodb').MongoClient;
var api_key = require('./config.json').key;
var options = require('./config.json');
var helper = require('./helper.js');

//TODO improve output (Time from float to int, logging interval etc)

helper.getMax(api_key)
.then(function(MAX) {
    MongoClient.connect('mongodb://localhost:27017/tmpusr', function(err, db) {
        if (err) {
            throw err;
        }

        console.log("Started at: " + new Date().toISOString());
        console.log("This application will log information whenever 1000 movies were processed");
        console.log("Still ned " + MAX + " Movies to process, estimated time: ~" + MAX/240 + " minutes\n");
        var insertions = 0;
        var i = 0;

        var interval = setInterval(() => {
            i++
            
            helper.getMovieData(i, options)
                .then((data) => {
                    db.collection('tmdb').insertOne(data);
                    insertions++;
                })
                .catch((error) => {
                    if (error.name == "StatusCodeError" && error.statusCode === 429) {
                        console.log("Accessed over 40 files within 10 seconds");
                        process.exit();
                    }
                    else if (error.name == "RequestError") {
                        i--;
                        console.log("Lost internet connection, retrying...");
                    }
                })
                .then(() => {
                    if (i % 40 == 0) {
                        console.log(new Date().toISOString());
                        console.log("inserted " + insertions + " movies, " + "processed " + i + " ID'S, " + (MAX - i) + " to go, estimated time: ~" + (MAX-i)/240 + " minutes\n");
                    }
                })

            if (i >= MAX) {
                console.log("Finished");
                clearInterval(interval);
            }
        }, 300)
    });
});


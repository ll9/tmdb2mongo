var request = require('request');

var getMax = function (api_key) {
    return new Promise(function(resolve, reject) {
        request("https://api.themoviedb.org/3/movie/latest?api_key="+api_key+"&language=en-US", 
        function (error, response, body) {
            if (error)
                reject(error);
            else {
                MAX = parseInt(JSON.parse(body).id);
                console.log("Successfully aquired latest movie id: " + MAX);
                resolve(MAX);
            }
        });
    });
};


module.exports.getMax = getMax;
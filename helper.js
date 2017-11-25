var request = require('request');
var rp = require('request-promise');

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

var getMovieData = (id, options) => {
    append_to_response = options.append_to_response.join(",");
    url = "https://api.themoviedb.org/3/movie/" + id + "?api_key=" + options.key + 
        (append_to_response ? ("&append_to_response="+append_to_response) : "");
    
    return new Promise((resolve, reject) => {
        rp(url)
            .then((html) => {
                data = JSON.parse(html);
                if (data.status_code != 34) {
                    resolve(data);
                }
            })
            .catch((error) => {
                reject(error.statusCode);
                if (error.statusCode === 429) { // made over 40 requests in 10 seconds
                    throw "Too many requests within 10 seconds (40 allowed)";
                }
            });
    });
};


module.exports.getMax = getMax;
module.exports.getMovieData = getMovieData;
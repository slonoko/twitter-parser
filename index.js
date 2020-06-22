var Twit = require('twit');
var fs = require('fs');

var Twitter = new Twit(require('./config.js'));


function search(callback) {

    Twitter.get(
        'search/tweets',
        { q: '%23stuttgart', count: 50 },
        function (err, data, response) {
            let tweetList = [];
            if (!err) {
                for (let i = 0; i < data.statuses.length; i++) {
                    let tweet = data.statuses[i];
                    tweetList.push(tweet);
                }
                callback(tweetList);
                return;
            } else {
                console.log(err);
            }
        }
    );
}

function saveToJson(tweets){
    var jsonData = JSON.stringify(tweets);
    fs.writeFile("tweets.json", jsonData, function(err) {
        if (err) {
            console.log(err);
        }
    });
}

search(saveToJson);
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

function saveToJson(tweets, index) {
    var jsonData = JSON.stringify(tweets, null, 2);
    fs.writeFile("tweets/tweets_" + index + ".json", jsonData, function (err) {
        if (err) {
            console.log(err);
        }
    });
}

function filter_stream(keywords) {
    var stream = Twitter.stream("statuses/filter", { track: keywords });
    console.info('Processing tweets ...');
    var tweets = [];
    var ids = [];
    var index = 1;

    if (!fs.existsSync("tweets")) {
        fs.mkdirSync("tweets");
    }

    stream.on('tweet', function (tweet_raw) {
        var tweet = tweet_raw.text;
        var id = tweet_raw.id;
        if (tweet_raw.extended_tweet != undefined) {
            tweet = tweet_raw.extended_tweet.full_text;
        } else if (tweet_raw.retweeted_status != undefined) {
            if (tweet_raw.retweeted_status.extended_tweet != null) {
                tweet = tweet_raw.retweeted_status.extended_tweet.full_text;
            } else {
                tweet = tweet_raw.retweeted_status.text;
            }
            id = tweet_raw.retweeted_status.id;
        }
        if (ids.indexOf(id) == -1) {
            ids.push(id);
            tweets.push(tweet);
        }
        if (tweets.length == 1000) {
            saveToJson(tweets, index);
            tweets = [];
            index++;
        }
    });
}


filter_stream(['stuttgart','stgt2106']);
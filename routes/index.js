// Generated by CoffeeScript 1.6.3
var home, tweet, tweetStory, user, webcam, youtubeStory;

var users = require('./users')
  , tweetStories = require('./tweetStories')
  , youtubeStories = require('./youtubeStories');

function home(req, res) {
    return res.render('index', {
        title: 'What Matters Most'
    });
};

function tweet(req, res) {
    return res.render('tweet');
}

function webcam(req, res) {
    return res.render('webcam');
}

exports.create = function(app) {
    app.get('/', home);
    app.get('/tweet', tweet);
    app.get('/webcam', webcam);
    users.create(app);
    tweetStories.create(app);
    youtubeStories.create(app);
};

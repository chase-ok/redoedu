
user = require './user'
tweetStory = require './tweetStory'
youtubeStory = require './youtubeStory'

home = (req, res) ->
    res.render 'index',
        title: 'What Matters Most'

exports.create = (app) ->
    app.get '/', home
    user.create app
    tweetStory.create app
    youtubeStory.create app

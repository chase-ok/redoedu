
user = require './user'

home = (req, res) ->
    res.render 'index',
        title: 'What Matters Most'

tweet = (req, res) ->
	res.render 'tweet'

webcam = (req, res) -> 
	res.render 'webcam'

exports.create = (app) ->
    app.get '/', home
    app.get '/tweet', tweet
    app.get '/webcam', webcam
    user.create app
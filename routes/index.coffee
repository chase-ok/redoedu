
user = require './user'

home = (req, res) ->
    res.render 'index',
        title: 'What Matters Most'

exports.create = (app) ->
    app.get '/', home
    user.create app

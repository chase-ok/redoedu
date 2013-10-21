
mongoose = require 'mongoose'

uri = process.env.MONGOLAB_URI or
      process.env.MONGOHQ_URL or
      'mongodb://localhost/redoedu'

exports.connect = () ->
    mongoose.connect uri, (err, res) ->
        if err
            console.log "Couldn't connect to MongoDB:"
            console.log err
        else
            console.log "Connected to MongoDB!"
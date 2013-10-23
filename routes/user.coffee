
{User} = require '../data/user'
{check} = require 'validator'


test = (req, res) ->
    testing = new User
        name: "Some Guy"
        email: "some.guy@gmail.com"
        joinDate: Date.now()
        age: 22
        category: "Student"
        location: "Needham, MA"
    testing.save (err) ->
        console.log err if err

    res.send "Hey there"

putEmail = (req, res) ->
    email = req.body.email
    try check(email).len(6, 64).isEmail()
    catch e
        res.json
            success: false
            error: e.message
        return
    
    user = new User
        email: email
    user.save (err) -> console.log "Couldn't save user: #{err}" if err
    res.json
        success: true

listEmails = (req, res) ->
    User.find {}, (err, users) ->
        if err 
            res.json
                success: false
                error: "" + err
        else 
            res.json
                success: true
                emails: user.email for user in users

exports.create = (app) ->
    app.put '/user/email', putEmail
    app.get '/user/email/all', listEmails
    app.get '/user/test', test
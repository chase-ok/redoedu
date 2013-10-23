
{User, userCategories} = require '../data/user'
{check} = require 'validator'
{checkAll, optional} = require '../lib/utils'


checkEmail = (req) ->
    check(req.body.email).len(6, 64).isEmail()
    req.body.email

checkName = (req) ->
    check(req.body.name).len(3, 64)
    req.body.name

checkAge = optional null, (req) ->
    check(req.body.age).isInt()
    req.body.name|0

checkCategory = (req) ->
    category = req.body.category
    try 
        check(category).isAlpha()
        if category not in userCategories
            throw "Not a recognized category: #{category}"
    catch e
        userCategories[0]

checkLocation = optional null, (req) ->
    check(req.body.location).len(2, 128)
    req.body.location


putEmail = (req, res) ->
    [err, {email}] = checkAll req, res,
        email: checkEmail
    console.log [err, email]
    return if err
    
    user = new User
        email: email
    user.save (err) -> console.log "Couldn't save user: #{err}" if err
    res.json {success: true}


putUser = (req, res) ->
    [err, fields] = checkAll req, res,
        email: checkEmail
        name: checkName
        age: checkAge
        category: checkCategory
        location: checkLocation
    return if err

    user = new User fields
    user.save (err) -> console.log "Couldn't save user: #{err}" if err

    res.json {success: true}


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
    app.put '/user', putUser
    app.get '/user/email/all', listEmails

{User, userCategories} = require '../data/user'
{check, checkAll, optional, fail, succeed} = require '../lib/utils'


checkEmail = (req) ->
    check(req.body.email).len(6, 64).isEmail()
    req.body.email

checkName = (req) ->
    check(req.body.name).len(3, 64)
    req.body.name

checkAge = optional -1, (req) ->
    check(req.body.age).isInt()
    req.body.age|0

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


postEmail = (req, res) ->
    [err, {email}] = checkAll req, res,
        email: checkEmail
    return if err
    
    user = new User
        email: email
    user.save (err) -> 
        if err then fail res, err
        else 
            #succeed res, {user}
            res.render 'success',
                title: 'What Matters Most'
                root: '../../public'


putUser = (req, res) ->
    [err, fields] = checkAll req, res,
        email: checkEmail
        name: checkName
        age: checkAge
        category: checkCategory
        location: checkLocation
    return if err

    user = new User fields
    user.save (err) -> 
        if err then fail res, err
        else succeed res, {user}

getUser = (req, res) ->
    console.log req.params.id
    User.findOne {_id: req.params.id}, (err, user) ->
        if err then fail res, err
        else succeed res, {user}


listEmails = (req, res) ->
    User.find {}, (err, users) ->
        if err then fail res, err
        else succeed res, 
            emails: user.email for user in users


exports.create = (app) ->
    app.post '/user/email', postEmail
    app.put '/user', putUser
    app.get '/user/:id', getUser
    app.get '/user/email/all', listEmails
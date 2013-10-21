
{User} = require '../data/user'

exports.list = (req, res) ->
    res.send "respond with a resource"


exports.test = (req, res) ->
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

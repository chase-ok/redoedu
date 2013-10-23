
mongoose = require 'mongoose'

exports.userCategories = ["General"
                          "Student",
                          "Parent", 
                          "Educator", 
                          "Admin"]

exports.userSchema = new mongoose.Schema
    name: String
    email: String
    joinDate: 
        type: Date
        default: Date.now
    age: 
        type: Number
        default: -1
    category: 
        type: String
        default: exports.userCategories[0]
    location: 
        type: String
        default: ""

exports.User = mongoose.model 'User', exports.userSchema
    

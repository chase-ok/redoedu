
var mongoose = require('mongoose')
  , _ = require('underscore');

exports.userCategories = ["General", "Student", "Parent", "Educator", "Admin"];
exports.storyTypes = ['Tweet', 'YouTube'];

exports.userSchema = new mongoose.Schema({
    name: String,
    email: String,
    joinDate: Date,
    age: {
        type: Number,
        "default": -1
    },
    category: {
        type: String,
        "default": exports.userCategories[0]
    },
    location: {
        type: String,
        "default": ""
    },
    storyType: String,
    numYoutubeStories: {
        type: Number,
        "default": 0,
    },
});

exports.userSchema.methods.registerSharedBy = function(user, cb) {
    _
};

exports.User = mongoose.model('User', exports.userSchema);

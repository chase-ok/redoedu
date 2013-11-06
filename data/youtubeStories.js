
var mongoose = require('mongoose')
  , _ = require('underscore');

var counter = {type: Number, default: 0};

exports.youtubeStorySchema = new mongoose.Schema({
    youtubeId: String,
    created: Date,
    added: Date,
    title: {type: String, default: ""},
    description: {type: String, default: ""},
    tags: [String],
    thumbnail: {
        standard: String,
        highQuality: String
    },
    views: {
        type: Number,
        default: 0,
        index: true
    },
    sharedBy: [{ 
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        views: counter
    }],
    sharesByNonUser: counter,
    nonUserShareViews: counter,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

exports.youtubeStorySchema.virtual('timesShared').get(function() {
    return _.reduce(this.sharedBy, function(sum, share) {
        return sum + share.numViews;
    }, this.sharesByNonUser);
});

exports.youtubeStorySchema.virtual('isShared').get(function() {
    return (this.sharesByNonUser + this.sharedBy.length) > 0;
});

exports.youtubeStorySchema.methods.findShare = function (user) {
    return _.find(this.sharedBy, function(share) {
        // assuming that shared by has not been populated
        return user._id == share.user;
    });
}

exports.youtubeStorySchema.methods.isSharedBy = function(user) {
    return null != this.findShare(user);
};

exports.youtubeStorySchema.methods.registerSharedBy = function(user) {
    if (!this.isSharedBy(user)) {
        this.sharedBy.push({user: user, views: 0});
    }
};

exports.youtubeStorySchema.methods.registerShareView = function(user) {
    if (!this.isSharedBy(user)) {
        console.log('Missed share registration');
        this.registerSharedBy(user);
    }
    this.findShare(user).views += 1;
}

exports.YoutubeStory = mongoose.model('YoutubeStory', exports.youtubeStorySchema);

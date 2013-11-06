
var mongoose = require('mongoose');

exports.tweetStorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tweets: [{ text: String}]
});

exports.TweetStory = mongoose.model('TweetStory', exports.tweetStorySchema);

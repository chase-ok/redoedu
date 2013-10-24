
var mongoose = require('mongoose');

exports.youtubeStorySchema = new mongoose.Schema({
    youtubeId: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

exports.YoutubeStory = mongoose.model('YoutubeStory', exports.youtubeStorySchema);

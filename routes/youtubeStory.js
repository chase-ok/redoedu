
var User = require('../data/user').User
  , YoutubeStory = require('../data/youtubeStory').YoutubeStory
  , utils = require('../lib/utils');

var youtubeIdRegEx = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

function checkYoutubeId(req) {
    var match = youtubeIdRegEx.exec(req.body.youtubeUrl);
    if (match == null) throw "Not a valid YouTube url";
    return match[1];
}

function putYoutubeStory(req, res) {
    var check = utils.checkAll(req, res, {youtubeId: checkYoutubeId});
    if (check[0]) return;
    var youtubeId = check[1].youtubeId;

    return User.findOne({_id: req.body.userId}, function(err, user) {
        if (err) return utils.fail(res, err);

        var story = new YoutubeStory({
            youtubeId: youtubeId,
            user: User
        });
        story.save(function(err) {
            if (err) utils.fail(res, err);
            else utils.succeed(res, {story: story});
        });
    });
}

function getYoutubeStory(req, res) {
    YoutubeStory.findOne({_id: req.params.id}, function(err, story) {
        if (err) utils.fail(res, err);
        else utils.succeed(res, {story: story});
    })
}


exports.create = function(app) {
    app.put('/story/youtube', putYoutubeStory);
    return app.get('/story/youtube/:id', getYoutubeStory);
};


var User = require('../data/user').User
  , YoutubeStory = require('../data/youtubeStory').YoutubeStory
  , utils = require('../lib/utils')
  , session = require('../lib/session')
  , _ = require('underscore');

var youtubeIdRegEx = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

function checkYoutubeId(req) {
    var match = youtubeIdRegEx.exec(req.body.youtubeUrl);
    if (match == null) throw "Not a valid YouTube url";
    return match[1];
}

function checkTitle(req) {
    if (req.body.title) {
        utils.check(req.body.title).len(1, 256);
        return req.body.title;
    } else return "";
}

function checkDescription(req) {
    if (req.body.description) {
        utils.check(req.body.description).len(0, 1024*4);
        return req.body.description;
    } else return "";
}

function checkTags(req) {
    if (req.body.tags) {
        for (var i = 0; i < req.body.tags.length; i++) {
            utils.check(req.body.tags[i]).len(1, 32);
        }
        return req.body.tags;
    } else return [];
}

function getIndex(req, res) {
    res.render('webcam');
}

function putStory(req, res) {
    var check = utils.checkAll(req, res, {
        youtubeId: checkYoutubeId,
        title: checkTitle,
        description: checkDescription,
        tags: checkTags
    });
    if (check[0]) return;

    YoutubeStory.findOne({youtubeId: check[1].youtubeId}, function(err, story) {
        if (story) return utils.fail(res, {
            message: "A story already exists with this YouTube video."
        });

        var story = new YoutubeStory({
            youtubeId: check[1].youtubeId,
            title: check[1].title,
            description: check[1].description,
            tags: check[1].tags,
            created: Date.now(),
            lastViewed: Date.now(),
        });

        session.getCurrentUser(req, function(err, user) {
            if (user) story.user = user;
            story.save(function(err) {
                if (err) utils.fail(res, err);
                else utils.succeed(res, {story: story});
            });
        });
    });
}

function getStory(req, res) {
    YoutubeStory.findById(req.params.storyId, function(err, story) {
        if (err) utils.fail(res, err);
        else utils.succeed(res, {story: story});
    });
}

function putStoryViewed(req, res) {
    YoutubeStory.findById(req.body.storyId, function(err, story) {
        if (err) return utils.fail(res, err);
        story.views += 1;
        story.lastViewed = Date.now();
        story.save(function(err) {
            if (err) utils.fail(res, err);
            else utils.succeed(res, {});
        });
    });
}

function getPopularStories(req, res) {
    var limit = parseInt(req.query.limit);
    if (isNaN(limit) || limit <= 0) limit = 10; 
    YoutubeStory.find() // {shared: True}
                .sort('-views')
                .limit(limit)
                .exec(function (err, stories) {
        if (err) utils.fail(res, err);
        else utils.succeed(res, {stories: stories});
    });
}

function putShareStory(req, res) {
    YoutubeStory.findById(req.body.storyId, function(err, story) {
        if (err) return utils.fail(res, err);

        session.getCurrentUser(req, function(err, user) {
            if (user) story.registerSharedBy(user);
            else story.sharesByNonUser += 1;

            //TODO: way to not hardlink this?
            var link = "http://www.redoedu.org/story/youtube/share/";
            link += story._id;
            if (user) link += "?user=" + user._id;

            utils.succeed(res, {link: link});
        });
    });
}

function getShareStory(req, res) {
    YoutubeStory.findById(req.params.storyId, function(err, story) {
        if (err || story == null) return res.render('youtubeNotFound'); 

        function done() {
            story.save(function(err) {
                if (err) console.log(err);
                res.redirect('/story/youtube#' + story._id);
            });
        }

        if (req.query.user) {
            User.findById(req.query.user, function(err, user) {
                if (err) res.redirect('/story/youtube/share/' + story._id);
                else {
                    story.registerShareView(user);
                    done();
                }
            });
        } else {
            story.nonUserShareViews += 1;
            done();
        }
    });
}

function putLinkUserToStory(req, res) {
    YoutubeStory.findById(req.body.storyId, function(err, story) {
        if (err) return utils.fail(res, err);
        if (story.user != null) return utils.fail(res, {
            message: "This story has already been linked to a user."
        });

        session.getCurrentUser(function(err, user) {
            if (err) return utils.fail(res, err);
            story.user = user;
            story.save(function(err) {
                if (err) utils.fail(res, err);
                else utils.succeed(res, {});
            });
        });
    });
}

exports.create = function(app) {
    app.get('/story/youtube', getIndex);
    app.put('/story/youtube/viewed', putStoryViewed);
    app.get('/story/youtube/popular', getPopularStories);
    app.put('/story/youtube/share', putShareStory);
    app.get('/story/youtube/share/:storyId', getShareStory);
    app.put('/story/youtube/link-user-to-story/:storyId', putLinkUserToStory);
    app.get('/story/youtube/story/:storyId', getStory);
    app.put('/story/youtube/story', putStory);
};

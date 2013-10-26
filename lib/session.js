
var User = require('../data/user').User;

exports.getCurrentUserId = function(req) {
    return null;
};

exports.getCurrentUser = function(req, cb) {
    var id = exports.getCurrentUserId();
    if (id == null) {
        cb({message: "No current user."}, null);
    } else User.findById({_id: id}, cb);
};
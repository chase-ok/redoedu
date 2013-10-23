// Generated by CoffeeScript 1.6.3
var User, check, checkAge, checkAll, checkCategory, checkEmail, checkLocation, checkName, fail, getUser, listEmails, optional, postEmail, putUser, succeed, userCategories, _ref, _ref1,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

_ref = require('../data/user'), User = _ref.User, userCategories = _ref.userCategories;

check = require('validator').check;

_ref1 = require('../lib/utils'), checkAll = _ref1.checkAll, optional = _ref1.optional, fail = _ref1.fail, succeed = _ref1.succeed;

checkEmail = function(req) {
  check(req.body.email).len(6, 64).isEmail();
  return req.body.email;
};

checkName = function(req) {
  check(req.body.name).len(3, 64);
  return req.body.name;
};

checkAge = optional(null, function(req) {
  check(req.body.age).isInt();
  return req.body.name | 0;
});

checkCategory = function(req) {
  var category, e;
  category = req.body.category;
  try {
    check(category).isAlpha();
    if (__indexOf.call(userCategories, category) < 0) {
      throw "Not a recognized category: " + category;
    }
  } catch (_error) {
    e = _error;
    return userCategories[0];
  }
};

checkLocation = optional(null, function(req) {
  check(req.body.location).len(2, 128);
  return req.body.location;
});

postEmail = function(req, res) {
  var email, err, user, _ref2, _ref3;
  console.log(req.body);
  console.log(req.body.email);
  _ref2 = checkAll(req, res, {
    email: checkEmail
  }), err = _ref2[0], (_ref3 = _ref2[1], email = _ref3.email);
  console.log([err, email]);
  if (err) {
    return;
  }
  user = new User({
    email: email
  });
  return user.save(function(err) {
    if (err) {
      return fail(res, err);
    } else {
      return res.render('success', {
        title: 'What Matters Most'
      });
    }
  });
};

putUser = function(req, res) {
  var err, fields, user, _ref2;
  _ref2 = checkAll(req, res, {
    email: checkEmail,
    name: checkName,
    age: checkAge,
    category: checkCategory,
    location: checkLocation
  }), err = _ref2[0], fields = _ref2[1];
  if (err) {
    return;
  }
  user = new User(fields);
  return user.save(function(err) {
    if (err) {
      return fail(res, err);
    } else {
      return succeed(res, {
        user: user
      });
    }
  });
};

getUser = function(req, res) {
  console.log(req.params.id);
  return User.findOne({
    _id: req.params.id
  }, function(err, user) {
    if (err) {
      return fail(res, err);
    } else {
      return succeed(res, {
        user: user
      });
    }
  });
};

listEmails = function(req, res) {
  return User.find({}, function(err, users) {
    var user;
    if (err) {
      return fail(res, err);
    } else {
      return succeed(res, {
        emails: (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = users.length; _i < _len; _i++) {
            user = users[_i];
            _results.push(user.email);
          }
          return _results;
        })()
      });
    }
  });
};

exports.create = function(app) {
  app.post('/user/email', postEmail);
  app.put('/user', putUser);
  app.get('/user/:id', getUser);
  return app.get('/user/email/all', listEmails);
};

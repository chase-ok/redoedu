
exports.check = require('validator').check;

exports.fail = function(res, error) {
    return res.json({
        success: false,
        error: error
    });
};

exports.succeed = function(res, resultObj) {
    resultObj = resultObj || {};
    if (resultObj == null) {
        resultObj = {};
    }
    resultObj.success = true;
    return res.json(resultObj);
};

exports.optional = function(defaultValue, fun) {
    return function(req, res) {
        try {
            return fun(req, res);
        } catch (_) {
            return defaultValue;
        }
    };
};

exports.doCheck = function(req, res, fun) {
    try {
        return [false, fun(req, res)];
    } catch (err) {
        exports.fail(res, err.message);
        return [true, null];
    }
};

exports.checkAll = function(req, res, fields) {
    var result = {};
    for (var name in fields) {
        var check = exports.doCheck(req, res, fields[name]);
        var checker = fields[name];
        if (check[0]) return [true, result];
        result[name] = check[1];
    }
    return [false, result];
};

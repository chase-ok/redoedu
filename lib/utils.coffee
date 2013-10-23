
{check: exports.check} = require 'validator'

exports.fail = (res, error) ->
    res.json
        success: false
        error: error

exports.succeed = (res, resultObj={}) ->
    resultObj.success = true
    res.json resultObj

exports.optional = (defaultValue, fun) ->
    (req, res) ->
        try fun req, res
        catch e then defaultValue

exports.doCheck = (req, res, fun) ->
    try 
        [false, fun(req, res)]
    catch e
        exports.fail res, e.message
        [true, null]

exports.checkAll = (req, res, fields) ->
    result = {}
    for name, checker of fields
        [err, value] = exports.doCheck req, res, checker
        return [true, result] if err
        result[name] = value
    [false, result]
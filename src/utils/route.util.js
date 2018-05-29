var _ = require('lodash');
var camelize = require('../utils/format.camelize.util');
var underscorize = require('../utils/format.underscorize.util');
var mail = require('./mail.util');
var config = require('../config');


/// ************ Private methods ***********

function _nomalizeErrorResponse(error) {
    if (_.isString(error)) {
        error = { message: error };
    }

    if(error instanceof Error){
        err={};
        err.message = error.message;
        err.stack=error.stack;
        error=err;
    }

    if (!error.status) {
        error.status = 400;
    }

    if (!error.statusCode) {
        error.statusCode = 10400;
    }

    if (!error.message) {
        error.message = 'An error occured';
    }

    if (['DEV', 'QA'].indexOf(config.env) == -1)
        delete error.devError;

    var _status = error.status;
    delete error.status;

    var errorV2 = {
        config: {},
        status: _status,
        data: error
    };

    return errorV2;
}

function _nomalizeOkResponse(data) {
    if (!data && data !== false)
        data = '';

    if (_.isString(data)) {
        data = { data: data };
    }

    var _status = data.status || 200;
    delete data.status;

    var dataV2 = {
        config: {},
        status: _status,
        data: data
    };

    return dataV2;
}

function _format(req) {

    return function (data) {
        return data;
    }

    // due to some issue formating is removed
    var format = underscorize;

    var _case = req.query._case;
    if (_case && _case.toLowerCase() == 'underscore')
        format = underscorize;
    if (_case && _case.toLowerCase() == 'camel')
        format = camelize;
    return format;
}

var _errorNames = ['EvalError', 'RangeError', 'ReferenceError', 'SyntaxError', 'TypeError', 'URIError'];
async function _analyseError(error) {
    //Check if error is system error, if yes send notification
    if (_.isObject(error) && error.name && _errorNames.indexOf(error.name) >= 0) {
        mail.send({
            subject: error.message,
            text: error
        })
    }
}
/// ************ Private methods: END ***********


/// ************ Public methods ***********

/**
 * Promisified route helper
 * This function eliminates boilerplate code in your express request handlers
 * when using Promises in your own code.
 * This also makes sure that you won't forget to call next with an error.
 * `func` is your custom handler code and should always return a promise
 * 
 * @param {Function} func A handler function which should ALWAYS return a promise. Should have 'req', 'res' as mendatory parameter and next as optional parameter
 * `Normally next parameter is not suppose to use` 
 */

function createPromiseRoute(func) {
    return function route(req, res, next) {
        try {
            // var format = _format(req);
            /// here next is optional
            func(req, res, next)
                .then(function (data) {
                    res.json(_nomalizeOkResponse(data));
                })
                .catch(function (error) {
                    _analyseError(error);
                    error = _nomalizeErrorResponse(error);
                    res.json(error);
                });
        } catch (err) {
            next(err);
        }
    }
}

/**
 * Callback based route helper alternative of 'Promisified route helper'
 * 
 * @param {Function} func A handler function which should have 'req', 'res' and 'callback' as mendatory parameters. And next parameter as optional if required
 * `Normally next parameter is not suppose to use`
 */
function createRoute(func) {
    return function (req, res, next) {
        try {
            func(req, res, function (error, data) {
                if (error) {
                    error = _nomalizeErrorResponse(error);
                    res.status(error.status || 400).json(_format(req)(error));
                } else {
                    res.json(_format(req)(_nomalizeOkResponse(data)));
                }
            }, next); /// here next is optional 4th parameter

        } catch (err) {
            next(err);
        }
    }
}

/**
 * Help build a normalized format of error. It will make sure error have 'message', 'status' and 'statusCode' properties
 * 
 * @param {String|Object} error Error message or object. 
 * @param {Number} status Http status code (DEFAULT = 400)
 * @param {Number} statusCode Coworkings status code which may be correspond to http status or completely different (DEFAULT = 10400)
 */
function buildError(error, status, statusCode) {
    error = _nomalizeErrorResponse(error);

    // if status is defined take priority
    error.status = status || error.status;

    // if statusCode is defined take priority
    error.statusCode = statusCode || error.statusCode;

    // if status is defined and statusCode is not defined syn status and statusCode
    if (status && !statusCode)
        error.statusCode = 10 + '' + status; // if status is 400, it will create 10400
    return error
}

function getClientIp(req) {
    var ipAddress;
    // The request may be forwarded from local web server.
    var forwardedIpsStr = req.headers['x-forwarded-for'] || req.headers['X-Forwarded-For'];
    if (forwardedIpsStr) {
        // 'x-forwarded-for' header may return multiple IP addresses in
        // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
        // the first one
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        ipAddress = req.ip;
        if (ipAddress && ipAddress.substr(0, 7) == '::ffff:') {
            ipAddress = ipAddress.substr(7);
        }
    }
    if (!ipAddress) {
        // If request was not forwarded
        ipAddress = req.connection.remoteAddress;
    }
    if (ipAddress === '::1') {
        ipAddress = '127.0.0.1';
    }

    // ipv4 comes with additional number after actual ip like 115.112.99.50:28955. Remove the additional number
    var ipv4Match = ipAddress.match(/(\d{1,3}\.){3}\d{1,3}/g);
    // if length is greater than 1 it may be ipv6
    if (ipv4Match.length == 1) {
        ipAddress = ipv4Match[0];
    }

    return ipAddress;
};

/// ************ Public methods: End***********





module.exports = {
    createPromiseRoute: createPromiseRoute,
    createRoute: createRoute,
    buildError: buildError,
    getClientIp: getClientIp
};

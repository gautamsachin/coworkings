var bodyParser = require('body-parser'),
    path = require('path'),
    express = require('express'),
    cors = require('cors'),
    _app;

module.exports.errorHandler = __handleError;

/**
* We are taking some inputs directly out from process.env.
* One improvement here would be so that createApp would take all inputs
* as parameters so that the only entrypoint for any configuration to the
* express app would be through the parameters.
*/
module.exports.inject = function (app) {
    _app = app;

    //****** Express Middlewares: Starts **************
    // Convert all query string lower case 
    _app.use(__allQueryToLowerCase);
    _app.use(bodyParser.json());
    _app.use(bodyParser.urlencoded({ extended: false }));
    _app.use(cors());
    __definePublicPath();

    //****** Express Middlewares: End *****************

}


//*********************************************************************************** */
//************************Middlewares************************************************ */
//*********************************************************************************** */

/**
* Convert all query string lower case
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
function __allQueryToLowerCase(req, res, next) {
    for (var key in req.query) {
        req.query[key.toLowerCase()] = req.query[key];
        if (key != key.toLowerCase())
            delete req.query[key];
    }
    next();
}

/**
* 
*/
function __definePublicPath() {
    console.log('static path - ', path.join(__dirname, '../space_images'));
    if (process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'staging' || process.env.NODE_ENV == 'qa') {
        _app.use(express.static(path.join(__dirname, '../img')));
        _app.use(express.static(path.join(__dirname, '../space_images')));
    }
    else {
        _app.use(express.static(path.join(__dirname, '../img')));
        _app.use(express.static(path.join(__dirname, '../space_images')));
    }
}


function __handleError(err, req, res, next) {
    __errorLogger.apply(null, arguments);
    __errorResponder.apply(null, arguments);

}


/**
* 
* @param {*} err 
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
function __errorLogger(err, req, res) {
    console.error('Coworkings Error logger:-');
    var status = err.status ? err.status : 500;

    if (status >= 400) {
        console.error('Request url & body:-');
        console.error(req.url);
        console.error(JSON.stringify(req.body));
    }

    if (status >= 500) {
        console.log(err.stack);
    }
}

/**
* Error Responsder - Making consistent error response
* @param {Object} err 
* @param {Object} req 
* @param {Object} res 
* @param {Object} next 
*/
function __errorResponder(err, req, res, next) {
    var status = err.status ? err.status : 500;
    var httpMessage = 'Server Error';

    var message;
    if (status < 500) {
        message = httpMessage + ': ' + err.message;
    } else {
        message = httpMessage;
    }

    var response = { message: message };
    if (err.data) {
        response.errors = err.data;
    }

    res.status(status);
    res.send(response);
}

//*********************************************************************************** */
//************************Middlewares - END************************************************ */
//*********************************************************************************** */
var formatCamalize = require('./format.camelize.util');
var formatUnderscore = require('./format.underscorize.util');
var mail = require('./mail.util');
var paging = require('./paging.util');
var route = require('./route.util');
var winston = require('./logger.util');


module.exports = {
    logger: winston,
    format:{
        camalize: formatCamalize,
        underscore: formatUnderscore
    },
    mail,
    paging,
    route
}
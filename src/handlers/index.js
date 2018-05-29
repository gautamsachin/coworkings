var company = require('./company.handler');
var membership = require('./membership.handler');
var facebook = require('./oauth.facebook.handler');
var instagram = require('./oauth.instagram.handler');
var fileHandler = require('./file.handler'),
    serviceHandler = require('./services.handler'),
    countryHandler = require('./countries.handler'),
    userLocationHandler = require('./user-location.handler'),
    validationHandler = require('./validation.handler');




module.exports = {
    company,
    membership,
    facebook,
    instagram,
    fileHandler,
    serviceHandler,
    countryHandler,
    userLocationHandler,
    validationHandler
}
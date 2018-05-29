var config = require('../config'),
    nodemailer = require('nodemailer'),
    dateFormat = require('dateformat'),
    prettyjson = require('prettyjson'),
    _ = require('lodash');

var _mailconfig = {
    service: 'Gmail',
    auth: config.alert.smtpSetting.auth
};
var transport = nodemailer.createTransport(_mailconfig);

/**
* Send a mail
* return Promise if callback if not supplied otherwise return void
* @param {Object} mailObj should have at least text or html property
* @param {Function} optional callback function
*/
function sendMail(mailObj, callback) {
    var defaulMailObj = {
        from: config.alert.mail.from,
        to: config.alert.mail.to,
        subject: 'ALERT: Coworkings Node API'
    }

    var _obj = _.extend({}, defaulMailObj, mailObj);
    // format is important to be easily identify the source application & environament  of the alert
    _obj.subject = `Coworkings Node API : ${config.env} : ${_obj.subject} (${dateFormat(new Date(), 'yyyy/mm/dd')})`;

    // format the data for better readability
    if (_obj.text && typeof _obj.text == 'object') {
        _obj.text = prettyjson.render(_obj.text, { noColor: true });
    }

    if (!callback)
        return transport.sendMail(_obj);
    else if (typeof callback == 'function') {
        transport.sendMail(_obj, callback);
    }
}

module.exports = {
    send: sendMail
}
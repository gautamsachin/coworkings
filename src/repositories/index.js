// This is require to connect to db
require('./db.factory');
var membership = require('./membership.repository'),
    space = require('./space-repository'),
    facility = require('./facilty.repository'),
    perk = require('./perks.repository'),
    country = require('./country.repository');



module.exports = {
    membership,
    space,
    facility,
    perk,
    country
};
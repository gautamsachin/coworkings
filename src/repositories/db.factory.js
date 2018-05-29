var mongoose = require('mongoose');
var config = require('../config');
var logger = require('../utils').logger;
var autoIncrement = require('mongoose-auto-increment');

mongoose.connect(`mongodb://${config.db.server}:${config.db.port}/${config.db.name}`, {
    useMongoClient: true
});

autoIncrement.initialize(mongoose.connection);

mongoose.connection.on('connecting', function () {
    logger.info('Connecting to database...');
});


mongoose.connection.on('connected', function () {
    logger.info('Connected to database.');
});

mongoose.connection.on('error', function (err) {
    logger.info('An error happned in database.', err);
});


mongoose.Promise = Promise;

module.exports = mongoose;
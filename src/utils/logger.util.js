var winston = require('winston');

var wLogger = new winston.Logger({
    level: 'info',
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: './logs/info.log' })
    ]
  });


  module.exports = wLogger;
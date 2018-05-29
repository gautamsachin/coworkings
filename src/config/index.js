var common = require('./_env.common');
var dev = require('./_env.dev');
var qa = require('./_env.qa');
var stg = require('./_env.stg');
var prod = require('./_env.prod');
var _ = require('lodash');

var config = null;

if (!process.env.NODE_ENV)
    process.env.NODE_ENV = 'development';



if (process.env.NODE_ENV == 'development')
    config = _.defaultsDeep({}, common, dev.settings());
else if (process.env.NODE_ENV == 'qa')
    config = _.defaultsDeep({}, common, qa.settings());
else if (process.env.NODE_ENV == 'staging')
    config = _.defaultsDeep({}, common, stg.settings());
else if (process.env.NODE_ENV == 'production')
    config = _.defaultsDeep({}, common, prod.settings());

if(!process.env.PORT)
    process.env.PORT = config.PORT;

module.exports = config;
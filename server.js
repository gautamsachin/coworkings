var serverEngine = require('./src/server.configure');
var appEngine = require('./src/app.configure')
var router = require('./src/router');

var app = module.exports = require('express')()
var server = serverEngine.createServer(app);
appEngine.inject(app);
router.inject(app);

// Error handeler should register after routes has been registered
app.use(appEngine.errorHandler);



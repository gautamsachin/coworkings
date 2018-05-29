
module.exports.createServer = createServer;

function createServer(app) {
    var fs = require('fs'),
        https = require('https'),
        http = require('http'),
        config = require('./config')
    logger = require('./utils').logger;


    logger.info('Server is getting ready...');


    // var options = {
    //     key: fs.readFileSync('./ssl/ia.key'),
    //     cert: fs.readFileSync('./ssl/ia.crt'),
    //     ca: fs.readFileSync('./ssl/ca.crt')
    // };

    process.env.PORT = process.env.PORT || config.port;
    process.env.NODE_ENV = process.env.NODE_ENV || "development";


    var _server;
    // if production or on azure always use http. Azure will take care of https
    // environment variable WEBSITE_HOSTNAME will always be available on azure. It will be fully qualified azure web site  name
    if (process.env.NODE_ENV == 'production'
        || (process.env.WEBSITE_HOSTNAME && process.env.WEBSITE_HOSTNAME.indexOf('azurewebsites.net') >= 0)) {
        _server = http.createServer(app);
        _server.listen(process.env.PORT, function () {
            logger.info('Coworkings server listening on port %d in %s mode', process.env.PORT, process.env.NODE_ENV);
        });
    } else {
        var isSecure = false;
        if (isSecure)
            _server = https.createServer(options, app);
        else
            _server = http.createServer(app);

        _server.listen(process.env.PORT, function () {
            logger.info('Coworkings server listening on:-')
            config.api_paths.forEach(function (path) {
                logger.info('%s://localhost:%d%s in "%s" mode', isSecure ? 'https' : 'http', process.env.PORT, path, (process.env.NODE_ENV || '').toUpperCase());
            }, this);
        });
    }
    // server.on('listening', function() {
    //     console.log('Express server started on port %s at %s', server.address().port, server.address().address);
    // });

    return _server;
}

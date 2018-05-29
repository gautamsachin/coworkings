var route = require('../utils').route,
    geoip = require('geoip-lite');

function detectLocation() {
    return route.createPromiseRoute(async function (req, res) {
        let ip = '115.112.99.50' || route.getClientIp(req);
        let loc = geoip.lookup(ip);
        return { status: 200, data: loc }
    });
}

module.exports = {
    detectLocation
}
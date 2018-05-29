var route = require('../utils').route,
    countriesRepository = require('../repositories').country


function _listRoute() {
    return route.createPromiseRoute(async function (req, res) {
        let match = req.query.match;
        let regexMatch = match ? new RegExp(match, 'gi') : '';
        var s = await countriesRepository.findMatched(regexMatch);
        return { countries: s };
    });
}



module.exports = {
    list: _listRoute,
}
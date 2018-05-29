var route = require('../utils').route,
    facilityRepository = require('../repositories').facility,
    perksRepository = require('../repositories').perk


function _listRoute() {
    return route.createPromiseRoute(async function (req, res) {
        var s = await facilityRepository.get();
        return { spaces: s };
    });
}

function getPerksAndFacities() {
    return route.createPromiseRoute(async function (req, res) {
        var facilities = await facilityRepository.get();
        var perks = await perksRepository.get();
        return { facilities, perks };
    });
}

function createFacility() {
    return route.createPromiseRoute(async function (req, res) {
        return await facilityRepository.create(req.body);
    });
}

function createPerk() {
    return route.createPromiseRoute(async function (req, res) {
        return await perksRepository.create(req.body);
    });
}


module.exports = {
    list: _listRoute,
    getPerksAndFacities,
    createFacility,
    createPerk
}
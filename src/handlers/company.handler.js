var route = require('../utils').route,
    spaceRepository = require('../repositories').space,
    ObjectId = require('mongoose').Types.ObjectId,
    fileHandler = require('../handlers/file.handler')
    ;

function _listRoute() {
    return route.createPromiseRoute(async function (req, res) {
        let skip = parseInt(req.query.skip) || 0;
        let limit = parseInt(req.query.limit) || 10;
        let lat = parseFloat(req.query.lat, 10).toFixed(6);
        let lng = parseFloat(req.query.lng, 10).toFixed(6);
        let sort = req.query.sort || '';
        let order = req.query.order || 1;
        //why the sort is in ar
        let sortParam = sort ? { [sort]: order } : {};
        // concept of this lat and lng 
        lat = /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/.test(lat) ? lat : null;
        lng = /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/.test(lng) ? lng : null;
        // why the count is retrieved 1st
        let spaceCount = await spaceRepository.count();
        var spaceList = await spaceRepository.findByLocation(lat, lng, skip, limit, sortParam);
        var dd = _getDistance(lat, lng, spaceList);
        return { count: spaceCount, spaces: dd };
    }); 
}

function _createSpace() {
    return route.createPromiseRoute(async function (req, res, callback) {
        let userId = req.user.identity._id;
        let spaceData = { ...req.body, user_id: userId };
        let s = await spaceRepository.createSpace(spaceData);
        return { space: s };
    });
}

function _getDistance(lat, lng, spaces) {
    if (lat && lng) {
        return spaces.map(space => {
            // why is it set to the document directly
            space._doc.distanceUnit = 'km';
            space._doc.distanceFromUser = distance(lat, lng, space.address_lat, space.address_lng, space.distanceUnit);
            return space
        })
    }
    else {
        return spaces;
    }
}


function getNearByCompanies(lat, lng) {
    return route.createPromiseRoute(async function (req, res, callback) {
        let lat = parseFloat(req.query.lat, 10).toFixed(6);
        let lng = parseFloat(req.query.lng, 10).toFixed(6);
        let spaceIds = req.query.exc;

        if (spaceIds && typeof spaceIds === 'string') {
            spaceIds = spaceIds.split(',')
            spaceIds = spaceIds.map(id => ObjectId(id));
        }
        else {
            spaceIds = [];
        }

        lat = /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/.test(lat) ? lat : null;
        lng = /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/.test(lng) ? lng : null;
        let skip = 0;
        let limit = 4;
        let query = { _id: { $nin: spaceIds } };
        var spaceList = await spaceRepository.findByLocation(lat, lng, skip, limit, {}, query);
        var dd = _getDistance(lat, lng, spaceList);
        return { spaces: dd };
    });
}

function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "km") { dist = dist * 1.609344 }
    if (unit == "mi") { dist = dist * 0.8684 }
    // calculate using npm 
    //console.log(distanceCalculator(lat1,lon1,lat2,lon2))
    return dist.toFixed(2);
}

function searchSpaces() {
    return route.createPromiseRoute(async (req, res, next) => {
        let keywords = req.query.keywords;

        let skip = parseInt(req.query.skip) || 0;
        let limit = parseInt(req.query.limit) || 0;
        // let lat = parseFloat(req.query.lat, 10).toFixed(6);
        // let lng = parseFloat(req.query.lng, 10).toFixed(6);
        let sort = req.query.sort || '';
        let order = req.query.order || 1;
        let _regex = new RegExp(keywords, 'gi');

        let sortParam = sort ? { [sort]: order } : {};

        let orQueries = {
            $or: [
                { 'country.name': _regex },
                { city_location: _regex },
                { address_location: _regex },
                { facilities: { $elemMatch: { description: _regex } } },
                { perks: { $elemMatch: { description: _regex } } }
            ]
        };

        let count = await spaceRepository.count(orQueries);
        let spaces = await spaceRepository.find(orQueries,skip,limit,sortParam);


        return { count, spaces };
    });
}



function _updateSpace() {
    return route.createPromiseRoute(async function (req, res, next) {
        let userId = req.user.identity._id;
        let spaceId = req.params.id;
        let spaceData = { ...req.body, user_id: userId };

        let images = [].concat(spaceData.profile_images);
        if (spaceData.logo) {
            images.push(spaceData.logo)
        }
        fileHandler.saveImages(userId, spaceId, images, "update", async (err) => {
            if (err instanceof Error) {
                next(err);
            }
            else {
                let s = await spaceRepository.updateSpace(spaceId, spaceData);
                return { space: s };
            }
        });
    });
}

function getSpaceById() {
    return route.createPromiseRoute(async function (req, res, callback) {
        let id = ObjectId(req.params.id);
        let s = await spaceRepository.find({ _id: id });
        return { space: s && s instanceof Array ? s[0] : {} };
    });
}

function userSpaces() {
    return route.createPromiseRoute(async function (req, res, callback) {
        let userId = req.user.identity._id;
        let s = await spaceRepository.find({ user_id: userId });
        return { spaces: s };
    });
}


function removeSpace() {
    return route.createPromiseRoute(async function (req, res, callback) {
        let spaceId = ObjectId(req.params.id);

        let result = await spaceRepository.remove({ _id: spaceId });
        if (result && result.result && result.result.n > 0) {
            fileHandler.deleteSpaceFolder(req.params.id);
            return 'Space deleted successfully';
        }
        throw 'Error deleting space';
    });
}


module.exports = {
    list: _listRoute,
    create: _createSpace,
    update: _updateSpace,
    getById: getSpaceById,
    listUserSpace: userSpaces,
    getNearByCompanies,
    removeSpace,
    searchSpaces
}
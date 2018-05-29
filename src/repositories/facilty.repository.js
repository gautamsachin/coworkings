var mongoose = require('mongoose');
var facilityModel = require('../models').Facility;
var BaseRepository = require('./base.repository');


class FacilityRepository extends BaseRepository {}

module.exports = new FacilityRepository(facilityModel);



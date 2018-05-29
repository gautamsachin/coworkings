var mongoose = require('mongoose');
var perkModel = require('../models').Perk;
var BaseRepository = require('./base.repository');


class PerkRepository extends BaseRepository {}

module.exports = new PerkRepository(perkModel);


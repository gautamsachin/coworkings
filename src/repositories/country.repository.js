var mongoose = require('mongoose');
var countryModel = require('../models').Country;
var BaseRepository = require('./base.repository');

class CountryRepository extends BaseRepository {


    findMatched(match) {
    if(match){
        return this.model.find({$or:[{name:match},{code:match}]}).limit(7);
    }
    return this.model.find().limit(7);
   
    }


}

module.exports = new CountryRepository(countryModel);
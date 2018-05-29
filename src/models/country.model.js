require('../repositories/db.factory')
var mongoose = require('mongoose');

var autoIncrement = require('mongoose-auto-increment');

var _tableName = "countries";
var _modelName = 'Country';
var _pk = "country_id";

var schema = new mongoose.Schema({
    [_pk]: { type: Number, required: true, unique: true },
    "name": { type: String, required: true },
    "offset": { type: Number, required: true },
    "code": { type: String, required: true },
    "status": { type: Boolean, required: true },
});

schema.plugin(autoIncrement.plugin, {
    model: _modelName,
    field: _pk,
    startAt: 1,
    incrementBy: 1
});


module.exports = {
    model: mongoose.model(_modelName, schema, _tableName),
    schema: schema
};
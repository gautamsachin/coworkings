require('../repositories/db.factory')
var mongoose = require('mongoose');

var autoIncrement = require('mongoose-auto-increment');

var _tableName = "leads";
var _modelName = 'Lead';
var _pk = "lead_id";

var schema = new mongoose.Schema({
    [_pk]: { type: Number, required: true, unique: true },
    "name": { type: String, required: true },
    "email": { type: Number, required: false },
    "mobile_number": {
        code: { type: String },
        mobile: { type: Number },
    },
    "message": { type: Boolean, required: false },
    "lead_type": { type: String, required: true }
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
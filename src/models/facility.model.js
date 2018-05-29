var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var _tableName = "facilities";
var _modelName = 'Facility';
var _pk = "facility_id";

var schema = new mongoose.Schema({
    [_pk]: { type: Number, required: true, unique: true },
    "name": { type: String, required: true },
    "status": { type: Boolean, required: true, default: true }
});

schema.plugin(autoIncrement.plugin, {
    model: _modelName,
    field: _pk,
    startAt: 1,
    incrementBy: 1
});

let Model = mongoose.model(_modelName, schema, _tableName);

var facilitySchema = {
    facility_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Perk',
        validate: {
            validator: async function (v) {
                try {
                    let doc = await Model.find({ _id: v });
                    if (!doc || !doc.length) {
                        return false;
                    }
                    return true;
                }
                catch (err) {
                    return false;
                }
    },
    message: 'Not a valid Facility'
}
    },
description: { type: String, required: true }
}


module.exports = {
    model: Model,
    schema: facilitySchema
};
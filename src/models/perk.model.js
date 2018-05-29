var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var _tableName = "perks";
var _modelName = 'Perk';
var _pk = "perk_id";

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

var perkSchema = {
    perk_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility',
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
            message: 'Not a valid Perk'
        }
    },
    description: { type: String, required: true }
};


module.exports = {
    model: Model,
    schema: perkSchema
};
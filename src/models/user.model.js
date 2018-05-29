var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var _tableName = "users";
var _modelName = 'User';
var _pk = "user_id";

var schema = new mongoose.Schema({
    [_pk]: { type: Number, required: true, unique: true },
    "first_name": { type: String, required: true },
    "last_name": { type: String, required: false, default: '' },
    "email": { type: String, required: true },
    "password": { type: String, required: true },
    "password_format": { type: String, required: true, default: 'hash' },
    "mobile_number": {
        code: { type: String },
        mobile: { type: Number },
    },
    "mobile_number_confirmed": { type: Boolean, required: false, default: false },
    "two_factor_enabled": { type: Boolean, required: false, default: false },
    "is_locked_out": { type: Boolean, required: true, default: false },
    "last_locked_out_date_utc": { type: Date, required: false },
    "last_login_date_utc": { type: Date, required: true, default: new Date().toISOString() },
    "last_password_change_date_utc": { type: Date, required: false },
    "failed_password_attempt_count": { type: Number, required: true, default: 0 },
    "is_active": { type: Boolean, required: true, default: true },
    "comment": { type: String, required: false },
    "ip_registration": { type: String, required: false },
    "ip_last_login": { type: String, required: false },
    "created_on_utc": { type: Date, required: true, default: new Date().toISOString() },
    "updated_on_utc": { type: Date, required: true, default: new Date().toISOString() }
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
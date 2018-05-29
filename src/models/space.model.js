var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment'),
    facilitySchema = require('./facility.model').schema,
    perkSchema = require('./perk.model').schema,
    UserModel = require('./user.model').model,
    CountryModel = require('./country.model').model,
    SPACE_PATH = 'space_images';


var _tableName = "spaces";
var _modelName = 'Space';
var _pk = "space_id";
var _fk = "user_id";


var schema = new Schema({
    [_pk]: { type: Number, required: true, unique: true },
    [_fk]: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        validate: {
            validator: async function (v) {
                try {
                    let doc = await UserModel.find({ _id: v });
                    if (!doc || !doc.length) {
                        return false;
                    }
                    return true;
                }
                catch (err) {
                    return false;
                }
            },
            message: 'Not a valid User'
        }
    },
    space_name: { type: String, required: true },
    address_location: { type: String, required: true },
    address_lat: { type: Number, required: true },
    address_lng: { type: Number, required: true },
    address_placeId: { type: String, required: true },
    address_rating: { type: Number, required: false },
    city_location: { type: String, required: true },
    city_lat: { type: Number, required: true },
    city_lng: { type: Number, required: true },
    city_placeId: { type: String, required: true },
    city_rating: { type: Number, required: false },
    profile_views: { type: Number, required: true, default: 0 },
    contacts: { type: Number, required: true, default: 0 },
    zipcode: { type: Number, required: true },
    country: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Country',
        validate: {
            validator: async function (v) {
                try {
                    let doc = await CountryModel.find({ _id: v });
                    if (!doc || !doc.length) {
                        return false;
                    }
                    return true;
                }
                catch (err) {
                    return false;
                }
            },
            message: 'Not a valid Country'
        }
    },
    price_per_seat: { type: Number, required: true },
    price_per_office: { type: Number, required: true },
    review_sync: { type: Boolean, required: true, default: true },
    description: { type: String, required: true },
    profile_images: { type: Array, required: true, minlength: 1, maxlength: 12 },
    header_image: { type: String, required: false },
    logo: { type: String, required: false },
    perks: [perkSchema],
    facilities: [facilitySchema],
    status: { type: Boolean, required: true, default: true },
    space_location: { type: Array, required: true, default: [this.address_lng, this.address_lat] },
    created_on_utc: { type: Date, required: true, default: new Date().toISOString() },
    updated_on_utc: { type: Date, required: true, default: new Date().toISOString() }
});

schema.plugin(autoIncrement.plugin, {
    model: _modelName,
    field: _pk,
    startAt: 1,
    incrementBy: 1
});

schema.index({ space_location: '2dsphere' }, { unique: false });

schema.pre('save', function (next) {
    let user_id = this.user_id.toString();
    let space_id = this.id;
    let files =[].concat(this.profile_images);
    if (this.logo) {
        files.push(this.logo)
    }
    this.header_image = this.profile_images[0];
    this.space_location = [this.address_lng, this.address_lat];
    require('../handlers/file.handler')
        .saveImages(user_id, space_id, files, 'create', next);
})



schema.post('find', function (doc) {
    let spaceList = doc;
    spaceList.map(space => {
        let profileImages = space.profile_images || [];
        space.profile_images = profileImages.map(img => {
            return {
                preview: `spaces/preview/space_${space._id}/${img}`,
                originalImage: img, originalPreview: `${space._id}/${img}`
            }
        });
        space._doc.logo = space.logo ?  {
            preview: `spaces/preview/space_${space._id}/${space.logo}`,
            originalImage: space.logo,
            originalPreview: `${space._id}/${space.logo}`
        } : {};
        space.header_image = space.profile_images[0].originalPreview;
        space._doc.header_image = space.header_image;
    })

});


module.exports = {
    model: mongoose.model(_modelName, schema, _tableName),
    schema: schema
};
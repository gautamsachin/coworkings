const validate = require('validate.js');

validate.validators.type = function (value, options, key, attributes) {
    if (value) {
        if (options === 'number') {
            if(!parseInt(value)){
                return `is not of ${options} type`;
            }
        }
        else if ((typeof value !== options && options !== 'array') || (options === 'array' && !(value instanceof Array))) {
                return `is not of ${options} type`;
            }
    }
};


const space_constraints = {
    space_name: { type: 'string', presence: true },
    address_location: { type: 'string', presence: true },
    address_lat: { type: 'number', presence: true },
    address_lng: { type: 'number', presence: true },
    address_placeId: { type: 'string', presence: true },
    address_rating: { type: 'number', presence: false },
    city_location: { type: 'string', presence: true },
    city_lat: { type: 'number', presence: true },
    city_lng: { type: 'number', presence: true },
    city_placeId: { type: 'string', presence: true },
    city_rating: { type: 'number', presence: false },
    zipcode: { type: 'number', presence: true },
    price_per_seat: { type: 'number', presence: true },
    price_per_office: { type: 'number', presence: true },
    description: { type: 'string', presence: true },
    profile_images: { type: 'array', presence: true },
    header_image: { type: 'string', presence: false },
    perks: { type: 'array', presence: true },
    facilities: { type: 'array', presence: true }
}


function validateSpaceData(req, res, next) {
    let errors = validate(req.body, space_constraints);
    if (errors) {
        res.send({ status: 400, data: { message: 'Space Validation Error', errors } })
    }
    else {
        next();
    }
}

module.exports = {
    validateSpaceData
}
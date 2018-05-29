var jwt = require('jsonwebtoken');
var _ = require('lodash');
var config = require('../config');
var claimTypes = require('./claimTypes');

var jwtPrivateKey = config.jwt_private_key;

// ********* PRIVATE methods : STARTS ********************

function signJWTToken(claims, expiry) {
    var options = { issuer: '.coworkings', audience: 'all' };
    if (expiry && expiry == 'never') {
        // do not define expiresIn option
    } else {
        options.expiresIn = expiry || '10h';
    }

    return jwt.sign(claims, jwtPrivateKey, options);
}

function varifyJwtToken(jwtToken) {
    try {
        var decoded = jwt.verify(jwtToken, jwtPrivateKey);
        var user = {
            identity: {
                is_authenticated: true,
                name: decoded[claimTypes.name],
                _id: decoded[claimTypes.nameIdentifier],
                user_id:decoded[claimTypes.user_id],
            },
            claims: [],
            roles: decoded[claimTypes.roles] || [],
            isInRole: function (roles) {
                //var _roles = this.claims[claimTypes.role];
                // if (!_roles || _roles.length == 0)
                //     return false;

                if (typeof roles == 'string')
                    roles = [roles];

                if (this.roles.length == 0)
                    return false;

                return _.intersection(this.roles, roles).length > 0;
            }
        };

        _.forEach(claimTypes, function (val, key) {
            if (decoded[val]) {
                user.claims[val] = decoded[val];
            }
        });

        return { success: true, user: user };
    } catch (ex) {
        return { success: false, message: 'Invalid token or token is expired.' };
    }
}

return module.exports = {
    sign: signJWTToken,
    verify: varifyJwtToken
}
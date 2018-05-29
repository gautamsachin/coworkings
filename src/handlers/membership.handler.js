var routeUtil = require('../utils').route;
var security = require('../security');
var cryptoJS = require("crypto-js");
var services = require('../services');
var ms = require('ms');
var _ = require('lodash');

var hashUtil = security.hash;

class _private {
    /**
     * Validate the grant_type passed by the user
     */
    static validateGrantType(req) {
        if (!req.body.grant_type)
            return { isValid: false, message: 'grant_type is required.' };


        //password_hash is to support old hashing password from client application
        if (['password', 'refresh_token'].indexOf(req.body.grant_type) == -1)
            return { isValid: false, message: 'Invalid grant_type.' };

        var result = { isValid: true };
        switch (req.body.grant_type) {

            case 'password':
                if (!req.body.username || !req.body.password)
                    result = { isValid: false, message: 'username & password are required for grant_type "password"' };
                break;
            case 'refresh_token':
                if (/*!req.body.client_id ||*/ !req.body.refresh_token)
                    result = { isValid: false, message: 'refresh_token is required for grant_type "refresh_token"' };
                break;
        }

        return result;
    }
    static constructJwtToken(user) {
        var tokenLife = '7d';
        var claimTypes = security.claimTypes
        var claims = {};
        claims[claimTypes.name] = user.email;
        claims[claimTypes.roles] = [claimTypes.role_company];
        claims[claimTypes.nameIdentifier] = user._id;
        claims[claimTypes.user_id] = user.user_id;


        var refreshTokenClaims = {};
        refreshTokenClaims[claimTypes.name] = user.email;
        refreshTokenClaims[claimTypes.nameIdentifier] = user.user_id;


        var jwtSignedToken = security.jwt.sign(claims, tokenLife);
        var jwtSignedRefreshToken = security.jwt.sign(refreshTokenClaims, '15m');
        var respToken = {
            'access_token': jwtSignedToken,
            'refresh_token': jwtSignedRefreshToken,
            created_At: new Date().toISOString(),
            user_Name: user.email.toLowerCase(),
            full_name: user.first_name
        }

        if (tokenLife != 'never') {
            respToken.expire_in = ms(tokenLife) / 1000; // convert into second
        }

        return respToken;
    }
    static validateToken(req) {
        var authHeader = _private.getToken(req);
        if (!authHeader) {
            return { isValid: false, message: 'No Authorization token supplied.' };
        }

        if (authHeader.schema.toLowerCase() != 'bearer') {
            return { isValid: false, message: 'Invalid Authorization schema. It should be bearer.' };
        }

        var result = security.jwt.verify(authHeader.token);

        if (result.success) {
            req.user = result.user;
            return { isValid: true };
        } else {
            return { isValid: false, message: result.message };
        }
    }
    static getToken(req) {
        try {
            var authStr = req.headers["authorization"];
            if (!authStr)
                authStr = req.query["authorization"];

            if (!authStr)
                return null;

            authStr = authStr.split(' ');
            return { schema: authStr[0], token: authStr[1] };
        } catch (ex) {

        }
    }
}

var _public = {
    tokenRoute: function () {
        return routeUtil.createPromiseRoute(async function (req, res) {
            var grantValResult = _private.validateGrantType(req);

            if (!grantValResult.isValid) {
                throw grantValResult.message;
            }
            var grant_type = req.body.grant_type.toLowerCase();

            if (grant_type == 'password') {
                // concatinate user name and password
                var hashedStr = hashUtil.hash(req.body.username, req.body.password);
                var user = await services.membership.validateAsync(req.body.username, hashedStr);
                if (user.success) {
                    return _private.constructJwtToken(user.data);
                }

                return { message: user.message, status: 400 };

            } else if (grant_type == 'refresh_token') {
                //TODO: Refresh token can still be improve
                var result = security.jwt.verify(req.body.refresh_token);
                if (result.success) {
                    var user = await services.membership.getUserByIdAsync(req.body.username, hashedStr);
                    if (user) {
                        return _private.constructJwtToken(user.data);
                    }
                } else {
                    return { message: result.message, status_code: 40100, status: 400 };
                }
            }

        });
    },

    authorizeRoute: function (roles) {
        return function (req, res, next) {

            if (roles && !_.isArray(roles))
                res.send({ status: 400, data: { message: 'Roles are expected to be of array type', statusCode: 400 } });

            roles = roles || [security.claimTypes.role_company];
            var result = _private.validateToken(req);

            if (result.isValid) {
                if (!req.user.isInRole(roles)) {
                    var message = 'Unauthrized request.',
                        statusCode = 10401;
                    res.send({ status: 401, data: { message: message, statusCode: statusCode } });
                }
                else {
                    next();
                }
            } else {
                res.send({ status: 401, data: { message: result.message, statusCode: 10401 } });
            }
        };
    },
    registerRoute: function () {
        return routeUtil.createPromiseRoute(async function (req, res) {
            req.body = req.body || {};
            req.body.ip_registration = routeUtil.getClientIp(req);
            return services.membership.registerAsync(req.body)

        });
    },

    getUser: function () {
        return routeUtil.createPromiseRoute(async function (req, res) {
            let userId = req.user.identity._id;
            let user = await services.membership.getUserByIdAsync(userId);
            return user;
        });
    },

    updateUser: function () {
        return routeUtil.createPromiseRoute(async function (req, res) {
            let userId = req.user.identity._id;
            let userData = req.body;
            if (userData.password) {
                userData.password = hashUtil.hash(userData.email, userData.password);
            }
            let user = await services.membership.updateUser(userId, userData);
            return user;
        });
    }

}




module.exports = {
    token: _public.tokenRoute,
    authorize: _public.authorizeRoute,
    register: _public.registerRoute,
    getUser: _public.getUser,
    updateUser: _public.updateUser
}
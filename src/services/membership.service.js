var repositories = require('../repositories');
var security = require('../security');
var utils = require('../utils');

async function validate(userName, hashedPassword) {
    try {
        var user = await repositories.membership.getUserByUserName(userName);
        if (user.success && user.data.password == hashedPassword)
            return { success: true, data: user.data };

        return { success: false, message: 'Invaid user name or password' };

    } catch (error) {
        throw 'Invalid username.';
    }
}




async function register(user) {
    var _password = user.password;
    if (!_password) {
        return { status: 400, message: 'Invalid Credentials' }
    }
    user.password = security.hash.hash(user.email, _password);

    try {

        var oldUser = await repositories.membership.getUserByUserName(user.email);
        if (oldUser.success) {
            return { status: 400, message: 'User already exist' };
        }


        var newUser = await repositories.membership.register(user);
        if (newUser) {
            return { status: 200, message: 'User successfully created' };
        }

    } catch (error) {
        throw {
            status: 500,
            statusCode: 10400,
            message: 'Error creating user',
            devError: error
        };
    }
}

async function getUserById(id) {
    return await repositories.membership.getUserById(id)
}

async function updateUser(id, data) {
    return await repositories.membership.update({ _id: id }, data);
}


async function getUserByName(name) {

}
module.exports = {
    validateAsync: validate,
    registerAsync: register,
    getUserByIdAsync: getUserById,
    getUserByNameAsync: getUserByName,
    updateUser
}
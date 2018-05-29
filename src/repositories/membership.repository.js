var mongoose = require('mongoose');
var userModel = require('../models').User;
var BaseRepository = require('./base.repository');
var _ = require('lodash');


class MembershipRepository extends BaseRepository {

    async getUserByUserName(username) {
        var users = await this.get({ email: username })
        if (users && users.length == 0)
            return { success: false, message: 'User not found' };
        return { success: true, data: users[0] };
    }

    async  getUserById(id) {
        let user = await this.model.find({ _id: id }, { first_name: 1, last_name: 1, mobile_number: 1, email: 1 });
        if (user && user.length == 0)
            throw 'User not found';
        return { status: 200,  user: user[0]  };
    }

    async searchUser(query) {
        return this.get(query);
    }
    async register(user) {
        return userModel.create(user);
    }

}



module.exports = new MembershipRepository(userModel);
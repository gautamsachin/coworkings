var mongoose = require('mongoose');
var spaceModel = require('../models').Space;
var BaseRepository = require('./base.repository');


class SpaceRepository extends BaseRepository {


      async createSpace(spaceData) {
            let space = await this.create(spaceData);
            return space;
      }

      async updateSpace(id, spaceData) {
            if (spaceData.profile_images && spaceData.profile_images.length) {
                  spaceData.header_image = spaceData.profile_images[0]
            }
            if (spaceData.address_lat && spaceData.address_lng) {
                  spaceData.space_location = [spaceData.address_lng, spaceData.address_lat]
            }

            let space = await this.update({ _id: id }, spaceData);
            return space;
      }

      async find(query, skipNumber = 0, limitNumber = 0, sortCriteria = {}) {
            let spaces = await this.model.find(query)
                  .sort(sortCriteria)
                  .skip(skipNumber)
                  .limit(limitNumber)
                  .populate({
                        path: 'country',
                        model: 'Country',
                        select: 'name'
                  })
                  .populate({
                        path: 'facilities.facility_id',
                        model: 'Facility',
                        select: 'name',
                  })
                  .populate({
                        path: 'perks.perk_id',
                        model: 'Perk',
                        select: 'name'
                  })

            return spaces;
      }

      async count(query) {
            return await this.model.count(query);
      }


      async findByLocation(lat, lng, skipNumber = 0, limitNumber = 0, sortCriteria = {}, query = {}) {
            let locationQuery = {};

            if (lat && lng) {
                  locationQuery = {
                        space_location: {
                              $near: {
                                    $geometry: {
                                          type: "Point",
                                          coordinates: [
                                                lng,
                                                lat
                                          ]
                                    }
                              }
                        }
                  }
            }

            return await this.model.find({
                  ...locationQuery,
                  ...query
            })
                  .sort(sortCriteria)
                  .skip(skipNumber)
                  .limit(limitNumber)
                  .populate('country', 'name')
                  .populate('user_id', 'mobile_number')
                  .populate({
                        path: 'facilities.facility_id',
                        model: 'Facility',
                        select: 'name'
                  })
                  .populate({
                        path: 'perks.perk_id',
                        model: 'Perk',
                        select: 'name'
                  })
      }


      async findByPagination(skipNumber, limitNumber, query) {
            return await this.model.find(query).skip(skipNumber).limit(limitNumber)
                  .populate('country', 'name')
                  .populate('user_id', 'mobile_number')
                  .populate({
                        path: 'facilities.facility_id',
                        model: 'Facility',
                        select: 'name'
                  })
                  .populate({
                        path: 'perks.perk_id',
                        model: 'Perk',
                        select: 'name'
                  })
      }
}

module.exports = new SpaceRepository(spaceModel);


class BaseRepository {

    constructor(model) {
        this.model = model;
    }

    async create(data) {
        return this.model.create(data);
    }

    async get(query) {
        return this.model.find(query);
    }

    async update(query, data) {
        return this.model.update(query, data);
    }

    async remove(query){
        return this.model.remove(query);
    }

}

module.exports = BaseRepository;
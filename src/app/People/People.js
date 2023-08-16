const db = require('../db');


class People {

    constructor(id) {
        this.id = id;
    }

    async init(){
        const personId = await db.swPeople.findByPk(this.id);
        if (!personId){
            return 0;
        }
        this.name = personId.name;
        this.mass = personId.mass;
        this.height = personId.height;
        this.homeworldName = personId.homeworld_name;
        this.homeworlId = personId.homeworld_id;
        return 1;
    }

    getName() {
        return this.name;
    }

    getMass() {
        return this.mass;
    }

    getHeight() {
        return this.height;
    }

    getHomeworldName() {
        return this.homeworldName;
    }

    getHomeworlId() {
        return this.homeworlId;
    }

    getWeightOnPlanet(planetId){
        throw new Error('To be implemented');
    }
}

module.exports = People;
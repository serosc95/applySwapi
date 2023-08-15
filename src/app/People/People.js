const db = require('../db');


class People {

    constructor(id) {
        this.id = id;
    }

    async init(){
        const people = await db.getPeople();
        const personId = people.filter((person) => person.id == this.id)[0];
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
const db = require('../db');

class Planet {
    constructor(id){
        this.id = id;
    }

    async init(){
        const planetId = await db.swPlanet.findByPk(this.id);
        if (!planetId){
            return 0;
        }
        this.name = planetId.name;
        this.gravity = planetId.gravity;
        return 1;
    }

    getName() {
        return this.name;
    }

    getGravity() {
        return this.gravity;
    }
}

module.exports = Planet;
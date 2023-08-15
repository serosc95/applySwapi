const Planet = require('./Planet');

const planetFactory = async (id) => {
    const planet = new Planet(id);
    const planetId = await planet.init();
    if (!planetId){
        return 0;
    }
    return {
        "name": planet.getName(),
        "gravity": planet.getGravity()
    }
}

module.exports = { planetFactory }
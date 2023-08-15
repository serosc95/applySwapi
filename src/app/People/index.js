// const CommonPeople = require('./commonPeople');
const People = require('./People');

const peopleFactory = async (id) => {
    const people = new People(id);
    const personId = await people.init();
    if (!personId){
        return 0;
    }
    return {
        "name": people.getName(),
        "mass": people.getMass(),
        "height": people.getHeight(),
        "homeworldName": people.getHomeworldName(),
        "homeworldId": people.getHomeworlId().split("/")[people.getHomeworlId().split("/").length - 1]
    }
}

module.exports = { peopleFactory }
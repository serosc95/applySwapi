
const _isWookieeFormat = (req) => {
    if(req.query.format && req.query.format == 'wookiee'){
        return true;
    }
    return false;
}

const getNumberRandom = (min, max, except = 0) => {
    let randomNumber;
    
    do {
      randomNumber = Math.floor(Math.random() * max) + min;
    } while (randomNumber === 0 || randomNumber === except);
    
    return randomNumber.toString();
}


const applySwapiEndpoints = (server, app) => {

    server.get('/hfswapi/test', async (req, res) => {
        const data = await app.swapiFunctions.genericRequest('https://swapi.dev/api/', 'GET', null, true);
        res.send(data);
    });

    server.get('/hfswapi/getPeople/:id', async (req, res) => {
        try {
            const id = req.params.id;
            let data = await app.people.peopleFactory(id);
            if (!data){
                const response_people = await app.swapiFunctions.genericRequest(`https://swapi.dev/api/people/${id}`, 'GET', null, false);

                const homeworldId = response_people.homeworld.split("/")[response_people.homeworld.split("/").length - 2];
                const response_planet = await app.swapiFunctions.genericRequest(`https://swapi.dev/api/planets/${homeworldId}`, 'GET', null, false);
                
                data = {
                    "name": response_people.name,
                    "mass": isNaN(parseInt(response_people.mass)) ? "unknown" : parseInt(response_people.mass),
                    "height": isNaN(parseInt(response_people.height)) ? "unknown" : parseInt(response_people.height),
                    "homeworldName": response_planet.name,
                    "homeworldId": homeworldId
                }
            }
            res.send(data); 
        } catch (error) {
            res.sendStatus(501);
        }
    });

    server.get('/hfswapi/getPlanet/:id', async (req, res) => {
        try {
            const id = req.params.id;
            let data = await app.planet.planetFactory(id);
            if (!data){
                const response_planet = await app.swapiFunctions.genericRequest(`https://swapi.dev/api/planets/${id}`, 'GET', null, false);
                
                data = {
                    "name": response_planet.name,
                    "gravity": isNaN(parseInt(response_planet.gravity.split()[0])) ? "unknown" : parseInt(response_planet.gravity.split()[0]),
                }
            }
            res.send(data); 
        } catch (error) {
            res.sendStatus(501);
        }
    });

    server.get('/hfswapi/getWeightOnPlanetRandom', async (req, res) => {
        try {
            const id_people = getNumberRandom(1, 83, 17);
            const id_planet = getNumberRandom(1, 60);

            let data_people = await app.people.peopleFactory(id_people);
            if (!data_people){
                const response_people = await app.swapiFunctions.genericRequest(`https://swapi.dev/api/people/${id_people}`, 'GET', null, false);
                
                const homeworldId = response_people.homeworld.split("/")[response_people.homeworld.split("/").length - 2];
                
                data_people = {
                    "name": response_people.name,
                    "mass": isNaN(parseInt(response_people.mass)) ? "unknown" : parseInt(response_people.mass),
                    "homeworldId": homeworldId
                }
            }

            if (data_people.homeworldId == id_planet){
                throw new Error('Se esta calculando el peso del personaje en su planeta natal');
            }

            let data_planet = await app.planet.planetFactory(id_planet);
            if (!data_planet){
                const response_planet = await app.swapiFunctions.genericRequest(`https://swapi.dev/api/planets/${id_planet}`, 'GET', null, false);
                
                data_planet = {
                    "name": response_planet.name,
                    "gravity": isNaN(parseInt(response_planet.gravity.split()[0])) ? "unknown" : parseInt(response_planet.gravity.split()[0]),
                }
            }
            
            const data = {
                "name": data_people.name,
                "nameWorld": data_planet.name,
                "mass": data_people.mass,
                "gravity": data_planet.gravity,
                "peso": typeof data_people.mass === "string" || typeof data_people.gravity === "string" ? "unknown" : data_people.mass * data_planet.gravity
            }
            res.send(data); 
        } catch (error) {
            res.sendStatus(501);
        }
    });

    server.get('/hfswapi/getLogs',async (req, res) => {
        const data = await app.db.logging.findAll();
        res.send(data);
    });

}

module.exports = applySwapiEndpoints;
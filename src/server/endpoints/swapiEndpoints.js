
const _isWookieeFormat = (req) => {
    if(req.query.format && req.query.format == 'wookiee'){
        return true;
    }
    return false;
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
                    "mass": parseInt(response_people.mass),
                    "height": parseInt(response_people.height),
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
        res.sendStatus(501);
    });

    server.get('/hfswapi/getWeightOnPlanetRandom', async (req, res) => {
        res.sendStatus(501);
    });

    server.get('/hfswapi/getLogs',async (req, res) => {
        const data = await app.db.logging.findAll();
        res.send(data);
    });

}

module.exports = applySwapiEndpoints;
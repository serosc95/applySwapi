
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
            const isWookieeFormat = _isWookieeFormat(req);

            let data = await app.people.peopleFactory(id);
            
            if (isWookieeFormat){

                const responsePeopleFormat = await app.swapiFunctions.genericRequest(`https://swapi.dev/api/people/${id}/?format=wookiee`, 'GET', null, false);
                
                const homeworldId = responsePeopleFormat.acooscwoohoorcanwa.split("/")[responsePeopleFormat.acooscwoohoorcanwa.split("/").length - 2];
                const responsePlanetFormat = await app.swapiFunctions.genericRequest(`https://swapi.dev/api/planets/${homeworldId}/?format=wookiee`, 'GET', null, false);
                
                data = {
                    "name": responsePeopleFormat.whrascwo,
                    "mass": isNaN(parseInt(responsePeopleFormat.scracc)) ? "unknown" : parseInt(responsePeopleFormat.scracc),
                    "height": isNaN(parseInt(responsePeopleFormat.acwoahrracao)) ? "unknown" : parseInt(responsePeopleFormat.acwoahrracao),
                    "homeworldName": responsePlanetFormat.whrascwo,
                    "homeworldId": homeworldId
                }
            }
            
            if (!data && !isWookieeFormat){
                const responsePeople = await app.swapiFunctions.genericRequest(`https://swapi.dev/api/people/${id}`, 'GET', null, false);

                const homeworldId = responsePeople.homeworld.split("/")[responsePeople.homeworld.split("/").length - 2];
                const responsePlanet = await app.swapiFunctions.genericRequest(`https://swapi.dev/api/planets/${homeworldId}`, 'GET', null, false);
                
                data = {
                    "name": responsePeople.name,
                    "mass": isNaN(parseInt(responsePeople.mass)) ? "unknown" : parseInt(responsePeople.mass),
                    "height": isNaN(parseInt(responsePeople.height)) ? "unknown" : parseInt(responsePeople.height),
                    "homeworldName": responsePlanet.name,
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
                const responsePlanet = await app.swapiFunctions.genericRequest(`https://swapi.dev/api/planets/${id}`, 'GET', null, false);
                
                data = {
                    "name": responsePlanet.name,
                    "gravity": isNaN(parseInt(responsePlanet.gravity.split()[0])) ? "unknown" : parseInt(responsePlanet.gravity.split()[0]),
                }
            }
            res.send(data); 
        } catch (error) {
            res.sendStatus(501);
        }
    });

    server.get('/hfswapi/getWeightOnPlanetRandom', async (req, res) => {
        try {
            const idPeople = getNumberRandom(1, 83, 17);
            const idPlanet = getNumberRandom(1, 60);

            let dataPeople = await app.people.peopleFactory(idPeople);
            if (!dataPeople){
                const responsePeople = await app.swapiFunctions.genericRequest(`https://swapi.dev/api/people/${idPeople}`, 'GET', null, false);
                
                const homeworldId = responsePeople.homeworld.split("/")[responsePeople.homeworld.split("/").length - 2];
                
                dataPeople = {
                    "name": responsePeople.name,
                    "mass": isNaN(parseInt(responsePeople.mass)) ? "unknown" : parseInt(responsePeople.mass),
                    "homeworldId": homeworldId
                }
            }

            if (dataPeople.homeworldId == idPlanet){
                throw new Error('Se esta calculando el peso del personaje en su planeta natal');
            }

            let dataPlanet = await app.planet.planetFactory(idPlanet);
            if (!dataPlanet){
                const responsePlanet = await app.swapiFunctions.genericRequest(`https://swapi.dev/api/planets/${idPlanet}`, 'GET', null, false);
                
                dataPlanet = {
                    "name": responsePlanet.name,
                    "gravity": isNaN(parseInt(responsePlanet.gravity.split()[0])) ? "unknown" : parseInt(responsePlanet.gravity.split()[0]),
                }
            }
            
            const data = {
                "name": dataPeople.name,
                "nameWorld": dataPlanet.name,
                "mass": dataPeople.mass,
                "gravity": dataPlanet.gravity,
                "peso": typeof dataPeople.mass === "string" || typeof dataPeople.gravity === "string" ? "unknown" : dataPeople.mass * dataPlanet.gravity
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
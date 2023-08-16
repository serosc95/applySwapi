'use strict';

const Sequelize = require('sequelize');
const models = require('./models');

let sequelize;

sequelize = new Sequelize("sqlite::memory:", {
  logging: false //console.log
});

const db = {
	Sequelize,
	sequelize,
};

for (const modelInit of models) {
	const model = modelInit(db.sequelize, db.Sequelize.DataTypes);
	db[model.name] = model;
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


const initDB = async () => {
  await db.swPeople.sync({ force: true });
  await db.swPlanet.sync({ force: true });
  await db.logging.sync({ force: true });
}

const populateDB = async () => {
  await db.swPlanet.bulkCreate([
    {
      name: "Tatooine",
      gravity: 1.0
    }
  ]);
  await db.swPeople.bulkCreate([
    {
      name: "Luke Skywalker",
      height: 172,
      mass: 77,
      homeworld_name: "Tatooine",
      homeworld_id: "/planets/1"
    }
  ]);
}

const setLoggingDB = async (url, headers, ip) => {
  await db.logging.create(
    {
      action: url,
      header: headers,
      ip: ip
    }
  );
}

const deleteDB = async () => {
  await db.swPeople.drop();
  await db.swPlanet.drop();
  await db.logging.drop();
}

const watchDB = async () => {
  const planets = await db.swPlanet.findAll({
    raw: true,
  });

  const people = await db.swPeople.findAll({
    raw: true,
  });

  const logging = await db.logging.findAll({
    raw: true,
  });

  console.log("============= swPlanet =============");
  console.table(planets);
  console.log("\n");
  console.log("============= swPeople =============");
  console.table(people);
  console.log("\n");
  console.log("============= logging =============");
  console.table(logging);
}

const getPeople = async () => {
  const people = await db.swPeople.findAll({
    raw: true,
  });

  return people;
}

const getPlanets = async () => {
  const planets = await db.swPlanet.findAll({
    raw: true,
  });

  return planets;
}

db.initDB = initDB;
db.populateDB = populateDB;
db.watchDB = watchDB;
db.deleteDB = deleteDB;
db.getPeople = getPeople;
db.getPlanets = getPlanets;
db.setLoggingDB = setLoggingDB;

module.exports = db;

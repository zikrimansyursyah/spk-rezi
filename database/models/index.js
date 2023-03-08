"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const modelPath = process.cwd() + "/database/models/"; //add this line
const basename = path.basename(__dirname + "/../models/index.js"); //change this line
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(modelPath) //change this line
  .filter((file) => {
    return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js";
  })
  .forEach((file) => {
    const model = require(__dirname + "/../models/" + file)(sequelize, Sequelize.DataTypes); //change this line
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.users = require("./users.js")(sequelize, Sequelize);
db.prestasi = require("./prestasi.js")(sequelize, Sequelize);
db.absensi = require("./absensi.js")(sequelize, Sequelize);
db.bobot = require("./bobot.js")(sequelize, Sequelize);
db.bobot_nilai = require("./bobot_nilai.js")(sequelize, Sequelize);

module.exports = db;

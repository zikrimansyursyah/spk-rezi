"use strict";
const mysql2 = require("mysql2");
const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_DIALECT } = process.env;

// Uncommand this if you want to do sequelize-cli
// const DB_HOST = "localhost";
// const DB_USER = "root";
// const DB_PASS = "";
// const DB_NAME = "spk_rezi";
// const DB_DIALECT = "mysql";

module.exports = {
  development: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: DB_HOST,
    dialect: DB_DIALECT,
    define: {
      timestamps: false,
    },
    dialectModule: mysql2,
    logging: false,
  },
  test: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: DB_HOST,
    dialect: DB_DIALECT,
    logging: false,
    define: {
      timestamps: false,
    },
    dialectModule: mysql2,
  },
  production: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: DB_HOST,
    dialect: DB_DIALECT,
    dialectOptions: {
      ssl: true,
    },
    define: {
      timestamps: false,
    },
    dialectModule: mysql2,
    logging: false,
  },
};

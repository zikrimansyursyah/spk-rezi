"use strict";
const mysql2 = require("mysql2");
const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_DIALECT, DB_HOST_PROD, DB_USER_PROD, DB_PASS_PROD, DB_NAME_PROD, DB_DIALECT_PROD } = process.env;

// Uncommand this if you want to do sequelize-cli
// const DB_HOST = "localhost";
// const DB_USER = "root";
// const DB_PASS = "";
// const DB_NAME = "spk_rezi";
// const DB_DIALECT = "mysql";

module.exports = {
  development: {
    username: DB_USER_PROD,
    password: DB_PASS_PROD,
    database: DB_NAME_PROD,
    host: DB_HOST_PROD,
    dialect: DB_DIALECT_PROD,
    define: {
      timestamps: false,
    },
    dialectOptions: {},
    dialectModule: mysql2,
    logging: false,
  },
  test: {
    username: DB_USER_PROD,
    password: DB_PASS_PROD,
    database: DB_NAME_PROD,
    host: DB_HOST_PROD,
    dialect: DB_DIALECT_PROD,
    logging: false,
    define: {
      timestamps: false,
    },
    dialectModule: mysql2,
  },
  production: {
    username: DB_USER_PROD,
    password: DB_PASS_PROD,
    database: DB_NAME_PROD,
    host: DB_HOST_PROD,
    dialect: DB_DIALECT_PROD,
    dialectOptions: {},
    define: {
      timestamps: false,
    },
    dialectModule: mysql2,
    logging: false,
  },
};

"use strict";
const mysql2 = require("mysql2");
require('dotenv').config();
const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_DIALECT } = process.env;
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
  },
};
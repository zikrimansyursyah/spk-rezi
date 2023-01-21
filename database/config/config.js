"use strict";
const mysql2 = require("mysql2");
const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;
module.exports = {
  development: {
    username: "root",
    password: "",
    database: "spk_rezi",
    host: "localhost",
    dialect: "mysql",
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
    dialect: "mysql",
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
    dialect: "mysql",
    dialectOptions: {
      ssl: true,
    },
    define: {
      timestamps: false,
    },
    dialectModule: mysql2,
  },
};

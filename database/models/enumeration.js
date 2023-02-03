"use strict";
const { Model } = require("sequelize");
const Users = require("./users");
module.exports = (sequelize, DataTypes) => {
  class Enumeration extends Model {
    static associate(models) {
      Enumeration.hasMany(models.users);
      Enumeration.hasMany(models.kelas);
    }
  }
  Enumeration.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      alt_name: DataTypes.STRING(255),
      code: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "enumeration",
      tableName: "enumeration",
      associations: () => {
        Enumeration.hasMany(Users, {
          as: "user_type",
          foreignKey: id,
        });
      },
    }
  );
  return Enumeration;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bobot extends Model {
    static associate(models) {
      // FK Here
      Bobot.hasMany(models.bobot_nilai);
    }
  }
  Bobot.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      kode: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      nama_kriteria: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      tipe_kriteria: {
        type: DataTypes.ENUM("benefit", "cost"),
        allowNull: false,
      },
      bobot: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "bobot",
      tableName: "bobot",
      timestamps: false,
    }
  );
  return Bobot;
};

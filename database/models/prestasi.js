"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Prestasi extends Model {
    static associate(models) {
      // FK Here
      Prestasi.belongsTo(models.users, { foreignKey: "id_siswa" });
    }
  }
  Prestasi.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_siswa: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      semester: {
        type: DataTypes.ENUM("ganjil", "genap"),
        allowNull: false,
      },
      tahun_ajaran: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
      ranking: {
        type: DataTypes.ENUM(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
        allowNull: false,
      },
      created_date: DataTypes.DATE,
      created_by: DataTypes.INTEGER,
      updated_date: DataTypes.DATE,
      updated_by: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "prestasi",
      tableName: "prestasi",
      timestamps: false,
    }
  );
  return Prestasi;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Absensi extends Model {
    static associate(models) {
      // FK Here
      Absensi.belongsTo(models.users, { foreignKey: "id_siswa" });
    }
  }
  Absensi.init(
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
      bulan: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
      tahun: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
      hadir: DataTypes.INTEGER,
      izin: DataTypes.INTEGER,
      sakit: DataTypes.INTEGER,
      alfa: DataTypes.INTEGER,
      jumlah_pertemuan: DataTypes.INTEGER,
      created_date: DataTypes.DATE,
      created_by: DataTypes.INTEGER,
      updated_date: DataTypes.DATE,
      updated_by: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "absensi",
      tableName: "absensi",
      timestamps: false,
    }
  );
  return Absensi;
};

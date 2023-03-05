"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bobot_Nilai extends Model {
    static associate(models) {
      // FK Here
      Bobot_Nilai.belongsTo(models.bobot, { foreignKey: "id_bobot" });
    }
  }
  Bobot_Nilai.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_bobot: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nama_nilai: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      nilai: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "bobot_nilai",
      tableName: "bobot_nilai",
      timestamps: false,
    }
  );
  return Bobot_Nilai;
};

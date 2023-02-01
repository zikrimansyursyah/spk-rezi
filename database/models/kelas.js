'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kelas extends Model {
    static associate(models) {
      Kelas.belongsTo(models.enumeration, { as: 'kelas_type', foreignKey: 'kelas_type' });
      Kelas.hasMany(models.users);
    }
  }
  Kelas.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    kelas_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nama_kelas: {
      type: DataTypes.STRING(25),
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Kelas',
    tableName: "kelas",
  });
  return Kelas;
};
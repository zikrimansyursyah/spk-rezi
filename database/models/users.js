'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      Users.belongsTo(models.enumeration, { as: 'user_type', foreignKey: 'user_type' });
      Users.belongsTo(models.kelas, { as: 'kelas', foreignKey: 'id_kelas' });
    }
  }
  Users.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_kelas: DataTypes.INTEGER,
    nik: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    nisn: DataTypes.STRING(20),
    no_induk_sekolah: DataTypes.STRING(20),
    username: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    nama: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    tempat_lahir: DataTypes.STRING(255),
    tanggal_lahir: DataTypes.DATE,
    jenis_kelamin: DataTypes.STRING(10),
    alamat: DataTypes.STRING(1000),
    no_telp: DataTypes.STRING(14),
    created_date: DataTypes.DATE,
    created_by: DataTypes.INTEGER,
    updated_date: DataTypes.DATE,
    updated_by: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Users',
    tableName: "users",
  });
  return Users;
};
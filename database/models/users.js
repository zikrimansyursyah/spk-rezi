"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      // FK Here
      Users.hasMany(models.prestasi);
      Users.hasMany(models.absensi);
    }
  }
  Users.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_type: {
        type: DataTypes.ENUM("admin", "siswa"),
        allowNull: false,
      },
      nisn: DataTypes.STRING(20),
      no_induk_sekolah: DataTypes.STRING(20),
      tingkat_kelas: {
        type: DataTypes.ENUM("1", "2", "3", "4", "5", "6", "lulus"),
        allowNull: false,
        defaultValue: "lulus",
      },
      nama: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      tempat_lahir: DataTypes.STRING(255),
      tanggal_lahir: DataTypes.DATE,
      jenis_kelamin: {
        type: DataTypes.ENUM("laki-laki", "perempuan"),
        allowNull: false,
      },
      alamat: DataTypes.STRING(1000),
      no_telp: DataTypes.STRING(14),
      status_tempat_tinggal: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      jumlah_saudara_kandung: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_ayah_bekerja: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      nama_ayah: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      jenis_pekerjaan_ayah: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      pendapatan_perbulan_ayah: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_ibu_bekerja: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      nama_ibu: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      jenis_pekerjaan_ibu: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      pendapatan_perbulan_ibu: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_date: DataTypes.DATE,
      created_by: DataTypes.INTEGER,
      updated_date: DataTypes.DATE,
      updated_by: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "users",
      tableName: "users",
      timestamps: false,
    }
  );
  return Users;
};

-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 13, 2023 at 06:28 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.0.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `spk_rezi`
--

-- --------------------------------------------------------

--
-- Table structure for table `absensi`
--

CREATE TABLE `absensi` (
  `id` int(11) NOT NULL,
  `id_siswa` int(11) NOT NULL,
  `bulan` varchar(255) NOT NULL,
  `tahun` varchar(255) NOT NULL,
  `hadir` int(11) DEFAULT NULL,
  `izin` int(11) DEFAULT NULL,
  `sakit` int(11) DEFAULT NULL,
  `alfa` int(11) DEFAULT NULL,
  `jumlah_pertemuan` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `absensi`
--

INSERT INTO `absensi` (`id`, `id_siswa`, `bulan`, `tahun`, `hadir`, `izin`, `sakit`, `alfa`, `jumlah_pertemuan`, `created_date`, `created_by`, `updated_date`, `updated_by`) VALUES
(1, 5, 'Januari', '2013', 30, 10, 0, 0, 40, '2023-03-08 14:28:51', 1, '2023-03-08 16:18:14', 1),
(2, 5, 'Januari', '2014', 5, 0, 0, 7, 12, '2023-03-08 14:30:22', 1, '2023-03-08 14:30:22', 1),
(4, 5, 'Februari', '2013', 20, 8, 0, 12, 40, '2023-03-08 15:46:35', 1, '2023-03-08 15:46:35', 1);

-- --------------------------------------------------------

--
-- Table structure for table `bobot`
--

CREATE TABLE `bobot` (
  `id` int(11) NOT NULL,
  `kode` varchar(255) NOT NULL,
  `nama_kriteria` varchar(255) NOT NULL,
  `tipe_kriteria` enum('benefit','cost') NOT NULL,
  `bobot` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bobot`
--

INSERT INTO `bobot` (`id`, `kode`, `nama_kriteria`, `tipe_kriteria`, `bobot`) VALUES
(1, 'C1', 'Anggota Keluarga', 'benefit', '0'),
(2, 'C2', 'Status Pekerjaan Orang Tua', 'cost', '0'),
(3, 'C3', 'Status Tempat Tinggal', 'cost', '0'),
(4, 'C4', 'Pendapatan Perbulan', 'cost', '0'),
(5, 'C5', 'Absensi Anak', 'benefit', '0'),
(6, 'C6', 'Prestasi', 'benefit', '0');

-- --------------------------------------------------------

--
-- Table structure for table `bobot_nilai`
--

CREATE TABLE `bobot_nilai` (
  `id` int(11) NOT NULL,
  `id_bobot` int(11) NOT NULL,
  `nama_nilai` varchar(255) NOT NULL,
  `nilai` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bobot_nilai`
--

INSERT INTO `bobot_nilai` (`id`, `id_bobot`, `nama_nilai`, `nilai`) VALUES
(1, 1, '> 5 Orang', 4),
(2, 1, '4-5 Orang', 3),
(3, 1, '3 Orang', 2),
(4, 1, '2 Orang', 1),
(5, 2, 'Ayah dan Ibu Tidak Bekerja', 3),
(6, 2, 'Salah satu yang Bekerja', 2),
(7, 2, 'Ayah dan Ibu Bekerja', 1),
(8, 3, 'Rumah Pribadi', 1),
(9, 3, 'Mengontrak', 2),
(10, 4, '< Rp. 3,000,000.-', 4),
(11, 4, 'Rp. 3,000,001 - Rp. 5,000,000', 3),
(12, 4, 'Rp. 5,000,001 - Rp. 7,000,000', 2),
(13, 4, '> Rp. 7,000,000', 1),
(14, 5, 'Tidak pernah bolos', 4),
(15, 5, 'Alfa 1x dalam 6 bulan', 3),
(16, 5, 'Alfa 2-3x dalam 6bulan', 2),
(17, 5, 'Alfa > 3x dalam 6bulan', 1),
(18, 6, 'Juara 1 dikelas', 4),
(19, 6, 'Juara 2 atau 3 dikelas', 3),
(20, 6, 'Masuk juara 10 besar dikelas', 2),
(21, 6, 'Tidak juara kelas', 1);

-- --------------------------------------------------------

--
-- Table structure for table `prestasi`
--

CREATE TABLE `prestasi` (
  `id` int(11) NOT NULL,
  `id_siswa` int(11) NOT NULL,
  `semester` enum('ganjil','genap') NOT NULL,
  `tahun_ajaran` varchar(255) NOT NULL,
  `ranking` enum('1','2','3','4','5','6','7','8','9','10') NOT NULL,
  `created_date` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20230100000001-create-users.js'),
('20230100000002-create-bobot.js'),
('20230100000010-create-prestasi.js'),
('20230100000020-create-absensi.js'),
('20230100000030-create-bobot-nilai.js');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `user_type` enum('admin','siswa') NOT NULL,
  `nisn` varchar(255) DEFAULT NULL,
  `no_induk_sekolah` varchar(255) DEFAULT NULL,
  `nama` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `tempat_lahir` varchar(255) DEFAULT NULL,
  `tanggal_lahir` datetime DEFAULT NULL,
  `jenis_kelamin` enum('laki-laki','perempuan') NOT NULL,
  `alamat` varchar(255) DEFAULT NULL,
  `no_telp` varchar(255) DEFAULT NULL,
  `status_tempat_tinggal` varchar(255) NOT NULL,
  `jumlah_saudara_kandung` int(10) NOT NULL,
  `is_ayah_bekerja` tinyint(1) NOT NULL,
  `nama_ayah` varchar(255) NOT NULL,
  `jenis_pekerjaan_ayah` varchar(255) NOT NULL,
  `pendapatan_perbulan_ayah` int(11) NOT NULL,
  `is_ibu_bekerja` tinyint(1) NOT NULL,
  `nama_ibu` varchar(255) NOT NULL,
  `jenis_pekerjaan_ibu` varchar(255) NOT NULL,
  `pendapatan_perbulan_ibu` int(11) NOT NULL,
  `created_date` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `user_type`, `nisn`, `no_induk_sekolah`, `nama`, `username`, `password`, `tempat_lahir`, `tanggal_lahir`, `jenis_kelamin`, `alamat`, `no_telp`, `status_tempat_tinggal`, `jumlah_saudara_kandung`, `is_ayah_bekerja`, `nama_ayah`, `jenis_pekerjaan_ayah`, `pendapatan_perbulan_ayah`, `is_ibu_bekerja`, `nama_ibu`, `jenis_pekerjaan_ibu`, `pendapatan_perbulan_ibu`, `created_date`, `created_by`, `updated_date`, `updated_by`) VALUES
(1, 'admin', NULL, NULL, 'Administrator', 'admin', 'U2FsdGVkX19I3j53q2XRLGGUh+5sRbmxKpSbaICMHKs=', NULL, NULL, 'laki-laki', NULL, NULL, 'pribadi', 0, 1, 'Superadmin', 'Karyawan Swasta', 0, 0, 'Mom admin', 'Tidak Bekerja', 0, '2023-03-04 11:41:43', 1, NULL, NULL),
(5, 'siswa', '9994855512', '12345', 'Dzikri Mansyursyah Amin', 'zikri', 'U2FsdGVkX1+/xDUafxMMeJWdRmokl7GkvLO08/1v4d4=', 'Jakarta', '2023-03-14 17:00:00', 'laki-laki', 'Cendana V Blok D5 No. 17 RT. 04, RW.06, Pondok Rejeki, Kutabaru, Pasar Kemis', '085219623081', 'pribadi', 0, 0, 'John', 'Tidak Bekerja', 0, 1, 'Mom admin', 'Aparatur Sipil Negara', 123331212, '2023-03-07 17:14:41', 1, '2023-03-07 19:03:59', 1),
(6, 'siswa', '123123123123', '999888777', 'Egi', 'egi17', 'U2FsdGVkX18IIS5N5+5m4qve9ZG7lCVmzqLtj2jZ010=', 'Manado', '2023-03-08 17:00:00', 'laki-laki', 'Jakarta', '085219623081', 'mengontrak', 0, 1, 'John', 'Pegawai Swasta', 5000000, 0, 'Yunita M', '', 0, '2023-03-08 15:41:58', 1, '2023-03-08 15:41:58', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `absensi`
--
ALTER TABLE `absensi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_siswa` (`id_siswa`);

--
-- Indexes for table `bobot`
--
ALTER TABLE `bobot`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bobot_nilai`
--
ALTER TABLE `bobot_nilai`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_bobot` (`id_bobot`);

--
-- Indexes for table `prestasi`
--
ALTER TABLE `prestasi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_siswa` (`id_siswa`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `absensi`
--
ALTER TABLE `absensi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `bobot`
--
ALTER TABLE `bobot`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `bobot_nilai`
--
ALTER TABLE `bobot_nilai`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `prestasi`
--
ALTER TABLE `prestasi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `absensi`
--
ALTER TABLE `absensi`
  ADD CONSTRAINT `absensi_ibfk_1` FOREIGN KEY (`id_siswa`) REFERENCES `users` (`id`);

--
-- Constraints for table `bobot_nilai`
--
ALTER TABLE `bobot_nilai`
  ADD CONSTRAINT `bobot_nilai_ibfk_1` FOREIGN KEY (`id_bobot`) REFERENCES `bobot` (`id`);

--
-- Constraints for table `prestasi`
--
ALTER TABLE `prestasi`
  ADD CONSTRAINT `prestasi_ibfk_1` FOREIGN KEY (`id_siswa`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

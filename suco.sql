-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 16 Feb 2023 pada 07.46
-- Versi server: 10.4.27-MariaDB
-- Versi PHP: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `suco`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `notifikasi`
--

CREATE TABLE `notifikasi` (
  `idNotifikasi` int(11) NOT NULL,
  `namaNotifikasi` varchar(100) NOT NULL,
  `amount` double(9,2) NOT NULL,
  `percent` double(9,2) NOT NULL,
  `keteranganNotifikasi` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `notifikasi`
--

INSERT INTO `notifikasi` (`idNotifikasi`, `namaNotifikasi`, `amount`, `percent`, `keteranganNotifikasi`) VALUES
(1, 'Promosi Ulang Tahun', 20000.00, 0.00, 'Promosi yang diberikan kepada pelanggan yang berulang tahun'),
(2, 'Promosi Idul Fitri', 0.00, 15.00, 'Penawaran Khusus menjelang Hari Raya Idul Fitri');

-- --------------------------------------------------------

--
-- Struktur dari tabel `profile`
--

CREATE TABLE `profile` (
  `idProfile` int(11) NOT NULL,
  `namaDepan` varchar(100) NOT NULL,
  `namaBelakang` varchar(100) NOT NULL,
  `jeniskelamin` enum('L','P') NOT NULL,
  `tempatLahir` varchar(100) NOT NULL,
  `tanggalLahir` date NOT NULL,
  `ketBio` text NOT NULL,
  `idUser` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `profile`
--

INSERT INTO `profile` (`idProfile`, `namaDepan`, `namaBelakang`, `jeniskelamin`, `tempatLahir`, `tanggalLahir`, `ketBio`, `idUser`) VALUES
(1, 'Doni', 'Nurramdan', 'L', 'Ciamis', '1992-02-16', 'Programmer', 1),
(2, 'Doni', 'Indocyber', 'L', 'Ciamis', '1992-02-16', 'Programmer Indocyber', 2);

-- --------------------------------------------------------

--
-- Struktur dari tabel `promo`
--

CREATE TABLE `promo` (
  `idPromo` int(11) NOT NULL,
  `kodePromo` varchar(30) NOT NULL,
  `namaPromo` varchar(200) NOT NULL,
  `tanggalMulai` date NOT NULL,
  `TanggalAkhir` date NOT NULL,
  `idNotifikasi` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `promo`
--

INSERT INTO `promo` (`idPromo`, `kodePromo`, `namaPromo`, `tanggalMulai`, `TanggalAkhir`, `idNotifikasi`) VALUES
(1, 'ulp1a7', 'TEst', '2023-03-01', '2023-03-04', 1),
(2, 'wn7958', 'TEst', '2023-03-01', '2023-03-04', 1),
(3, 'MF5VYY', 'TEst', '2023-03-01', '2023-03-04', 1),
(4, 'R2K79U', 'TEst', '2023-03-01', '2023-03-04', 1),
(5, '8TF9AD', 'TEst', '2023-03-01', '2023-03-04', 1),
(6, 'UM9WOZ', 'Promo Ulang Tahun', '2023-03-01', '2023-03-04', 1),
(7, 'S4EWH9', 'Promo Ulang Tahun', '2023-03-01', '2023-03-04', 1),
(8, 'QUZ7GM', 'Promo Ulang Tahun', '2023-03-01', '2023-03-04', 1),
(9, 'ZQ5EDZ', 'Promo Ulang Tahun', '2023-03-01', '2023-03-04', 1),
(10, 'I60BE3', 'Promo Ulang Tahun', '2023-03-01', '2023-03-04', 1),
(11, 'NDN784', 'Promo Ulang Tahun', '2023-03-01', '2023-03-04', 1),
(12, 'BDX4VV', 'Promo Ulang Tahun', '2023-03-01', '2023-03-04', 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `idUser` int(11) NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `status` enum('Active','NonActive') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`idUser`, `username`, `password`, `email`, `status`) VALUES
(1, 'nurramdandoni', '4c80d5fc5db8e1f795d2f4fb2ac39fb08c253fbf', 'nurramdandoni@gmail.com', 'Active'),
(2, 'doni.nurramdan', 'doni.nurramdan', 'doni.nurramdan@indocyber.id', 'Active');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `notifikasi`
--
ALTER TABLE `notifikasi`
  ADD PRIMARY KEY (`idNotifikasi`);

--
-- Indeks untuk tabel `profile`
--
ALTER TABLE `profile`
  ADD PRIMARY KEY (`idProfile`),
  ADD KEY `idUser` (`idUser`);

--
-- Indeks untuk tabel `promo`
--
ALTER TABLE `promo`
  ADD PRIMARY KEY (`idPromo`),
  ADD KEY `idNotifikasi` (`idNotifikasi`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`idUser`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `notifikasi`
--
ALTER TABLE `notifikasi`
  MODIFY `idNotifikasi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `profile`
--
ALTER TABLE `profile`
  MODIFY `idProfile` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `promo`
--
ALTER TABLE `promo`
  MODIFY `idPromo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `profile`
--
ALTER TABLE `profile`
  ADD CONSTRAINT `profile_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`);

--
-- Ketidakleluasaan untuk tabel `promo`
--
ALTER TABLE `promo`
  ADD CONSTRAINT `promo_ibfk_1` FOREIGN KEY (`idNotifikasi`) REFERENCES `notifikasi` (`idNotifikasi`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

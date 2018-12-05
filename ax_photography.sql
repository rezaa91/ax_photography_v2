-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 01, 2018 at 11:40 PM
-- Server version: 5.7.24-0ubuntu0.18.04.1
-- PHP Version: 7.2.10-0ubuntu0.18.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ax_photography`
--

-- --------------------------------------------------------

--
-- Table structure for table `albums`
--

USE ax_photography;

CREATE TABLE `albums` (
  `album_id` int(10) UNSIGNED NOT NULL,
  `album_name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `cover_photo_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `albums`
--

INSERT INTO `albums` (`album_id`, `album_name`, `cover_photo_id`, `created_at`, `updated_at`) VALUES
(1, 'default', 1, '2018-11-25 21:28:00', '2018-11-25 21:28:00'),
(2, 'new album', 1, '2018-11-26 20:10:58', '2018-11-26 20:10:58'),
(3, 'newwww', 1, '2018-11-26 20:18:10', '2018-11-26 20:18:10'),
(4, 'even newer', 1, '2018-11-26 20:19:39', '2018-11-26 20:19:39'),
(5, 'This is a really new album', 1, '2018-11-29 20:08:33', '2018-11-29 20:08:33');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_resets_table', 1),
(3, '2018_11_18_191505_create_photos_table', 2),
(4, '2018_11_20_202946_add_username_to_users_table', 3);

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`email`, `token`, `created_at`) VALUES
('rezaa91@hotmail.co.uk', '$2y$10$gZCVxohI4Bw7.ncokiIowOyJ/hqPGw4X8SNO2S4ysryycNqZ1viGu', '2018-11-18 14:15:42');

-- --------------------------------------------------------

--
-- Table structure for table `photos`
--

CREATE TABLE `photos` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` mediumtext COLLATE utf8mb4_unicode_ci,
  `filepath` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `album_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `photos`
--

INSERT INTO `photos` (`id`, `title`, `description`, `filepath`, `created_at`, `updated_at`, `user_id`, `album_id`) VALUES
(18, 'test', 'test', 'test', '2018-11-19 21:49:32', '2018-11-19 21:49:32', 1, 1),
(19, 'test', '0', 'eminem_1543071932.jpg', '2018-11-24 15:05:32', '2018-11-24 15:05:32', 4, 1),
(20, 'test', '0', 'eminem_1543072010.jpg', '2018-11-24 15:06:50', '2018-11-24 15:06:50', 4, 1),
(21, 'test', '0', 'eminem_1543262645.jpg', '2018-11-26 20:04:05', '2018-11-26 20:04:05', 4, 1),
(22, 'test', '0', 'eminem_1543262669.jpg', '2018-11-26 20:04:29', '2018-11-26 20:04:30', 4, 1),
(23, 'test', '0', 'me_1543263001.jpeg', '2018-11-26 20:10:01', '2018-11-26 20:10:01', 4, 1),
(24, 'new album test', '1', 'eminem_1543263058.jpg', '2018-11-26 20:10:58', '2018-11-26 20:10:58', 4, 1),
(25, 'test', '0', 'eminem_1543263463.jpg', '2018-11-26 20:17:43', '2018-11-26 20:17:43', 4, 2),
(26, 'id 3', '0', 'eminem_1543263490.jpg', '2018-11-26 20:18:10', '2018-11-26 20:18:10', 4, 3),
(27, 'testing again', '0', 'Screenshot from 2018-11-12 19-54-12_1543263579.png', '2018-11-26 20:19:39', '2018-11-26 20:19:39', 4, 1),
(28, 'test type', '0', 'eminem_1543263754.jpg', '2018-11-26 20:22:34', '2018-11-26 20:22:34', 4, 4),
(29, 'Testing 29/11', '0', 'eminem_1543522113.jpg', '2018-11-29 20:08:33', '2018-11-29 20:08:33', 4, 5);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `username`) VALUES
(4, 'Ali Issaee', 'rezaa91@hotmail.co.uk', NULL, '$2y$10$5UNvKK9hn/wEuiY0ZUtfSOUOdYtQ.3E80VbNZu1pNL7zzWoU4BIdC', '8fcYovLZ3qE8c69C2EqPODSIMhYRKhgs9m1C3xHH0LIAQ9VDslwffbWcW8ep', '2018-11-20 22:06:20', '2018-11-24 13:37:55', 'rezaa91');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `albums`
--
ALTER TABLE `albums`
  ADD PRIMARY KEY (`album_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_email_index` (`email`);

--
-- Indexes for table `photos`
--
ALTER TABLE `photos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `photos_filepath_unique` (`filepath`),
  ADD KEY `photos_user_id_index` (`user_id`),
  ADD KEY `photos_album_id_index` (`album_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_username_unique` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `albums`
--
ALTER TABLE `albums`
  MODIFY `album_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `photos`
--
ALTER TABLE `photos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

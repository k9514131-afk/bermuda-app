-- Bermuda Royal Hospitality - Database Export (Final 2026)
-- Target: MySQL / MariaDB (horizon_db)

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `national_id` varchar(255) UNIQUE DEFAULT NULL,
  `username` varchar(255) UNIQUE DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','staff','customer') NOT NULL DEFAULT 'customer',
  `status` enum('pending','active','suspended') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed: Official Staff abouda7
INSERT INTO `users` (`name`, `email`, `username`, `password`, `role`, `status`) VALUES
('Eng. Abouda Staff', 'staff@bermuda.eg', 'abouda7', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'staff', 'active');

-- 2. Cities Table (13 Strategic Destinations)
CREATE TABLE IF NOT EXISTS `cities` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name_ar` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `slug` varchar(255) UNIQUE NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `cities` (`id`, `name_ar`, `name_en`, `slug`) VALUES
(1, 'القاهرة', 'Cairo', 'cairo'), (2, 'الجيزة', 'Giza', 'giza'), (3, 'الجونة', 'El Gouna', 'elgouna'), (4, 'الإسكندرية', 'Alexandria', 'alexandria'),
(5, 'مطروح', 'Matrouh', 'matrouh'), (6, 'أسوان', 'Aswan', 'aswan'), (7, 'الأقصر', 'Luxor', 'luxor'), (8, 'شرم الشيخ', 'Sharm El Sheikh', 'sharm'),
(9, 'دهب', 'Dahab', 'dahab'), (10, 'المنصورة', 'Mansoura', 'mansoura'), (11, 'سوهاج', 'Sohag', 'sohag'), (12, 'دمياط', 'Damietta', 'damietta'), (13, 'رأس سدر', 'Ras Sudr', 'rassudr');

-- 3. Hotels Table (39 Luxury Destinations)
CREATE TABLE IF NOT EXISTS `hotels` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `city_id` bigint(20) UNSIGNED NOT NULL,
  `name_ar` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `stars` int(11) DEFAULT 5,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `hotels` (`city_id`, `name_ar`, `name_en`) VALUES
(1, 'فورسيزونز نايل بلازا', 'Four Seasons Nile Plaza'), (1, 'ريتز كارلتون النيل', 'The Nile Ritz-Carlton'), (1, 'سانت ريجيس القاهرة', 'St. Regis Cairo'),
(3, 'ذا تشيدي الجونة', 'The Chedi El Gouna'), (3, 'شتايجنبرجر جولف', 'Steigenberger Golf'), (3, 'شيراتون ميرامار', 'Sheraton Miramar');

-- 4. Rooms Table (100 Operational Units)
CREATE TABLE IF NOT EXISTS `rooms` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `hotel_id` bigint(20) UNSIGNED NOT NULL,
  `number` varchar(50) NOT NULL,
  `type` enum('single','double','suite','family') NOT NULL DEFAULT 'double',
  `floor` int(11) DEFAULT 1,
  `base_price` decimal(12,2) NOT NULL,
  `status` enum('available','occupied','cleaning','maintenance') NOT NULL DEFAULT 'available',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`hotel_id`) REFERENCES `hotels`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed: Sample Rooms for Cairo Hotel 1
INSERT INTO `rooms` (`hotel_id`, `number`, `type`, `floor`, `base_price`, `status`) VALUES
(1, '101', 'double', 1, 22500.00, 'available'), (1, '102', 'double', 1, 22500.00, 'available'),
(1, '201', 'suite', 2, 45000.00, 'available'), (1, '202', 'suite', 2, 45000.00, 'available');

-- 5. Bookings Table
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `hotel_id` bigint(20) UNSIGNED NOT NULL,
  `room_id` bigint(20) UNSIGNED NOT NULL,
  `check_in` date NOT NULL,
  `check_out` date NOT NULL,
  `total_price` decimal(12,2) NOT NULL,
  `reference_no` varchar(100) UNIQUE NOT NULL,
  `status` varchar(50) DEFAULT 'Active',
  `is_paid` boolean DEFAULT 0,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`hotel_id`) REFERENCES `hotels`(`id`),
  FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Payment Simulations
CREATE TABLE IF NOT EXISTS `payment_simulations` (
  `id` char(36) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `temp_reference` varchar(255) NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `payload` longtext DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;

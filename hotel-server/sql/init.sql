-- Easy Stay Hotel Reservation System
-- MySQL 8.0+ 初始化脚本

CREATE DATABASE IF NOT EXISTS hotel_preorder DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hotel_preorder;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(64) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','merchant') NOT NULL DEFAULT 'merchant',
  display_name VARCHAR(128) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hotels (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(1024) NULL,
  address VARCHAR(512) NOT NULL,
  area VARCHAR(128) NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  score DECIMAL(3,1) NOT NULL DEFAULT 0,
  score_label VARCHAR(32) NOT NULL DEFAULT '新开业',
  star TINYINT NOT NULL DEFAULT 3,
  status ENUM('pending','approved','rejected','offline') NOT NULL DEFAULT 'pending',
  description TEXT NULL,
  facilities_json JSON NULL,
  tags_json JSON NULL,
  details_json JSON NULL,
  owner_username VARCHAR(64) NOT NULL,
  reject_reason VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_hotels_owner FOREIGN KEY (owner_username) REFERENCES users(username)
);

CREATE TABLE IF NOT EXISTS rooms (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  hotel_id BIGINT NOT NULL,
  name VARCHAR(128) NOT NULL,
  description VARCHAR(255) NULL,
  price DECIMAL(10,2) NOT NULL,
  breakfast_included TINYINT(1) NOT NULL DEFAULT 0,
  refundable TINYINT(1) NOT NULL DEFAULT 1,
  bed_type ENUM('single','double','twin','family','suite','other') NOT NULL DEFAULT 'other',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_rooms_hotel FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
);

INSERT INTO users (username, password, role, display_name)
VALUES
('admin', '123', 'admin', '系统管理员'),
('merchant', '123', 'merchant', '希尔顿酒店集团'),
('merchant2', '123', 'merchant', '如家酒店连锁')
ON DUPLICATE KEY UPDATE username = VALUES(username);

INSERT INTO hotels (name, image, address, area, price, score, score_label, star, status, description, facilities_json, tags_json, details_json, owner_username)
VALUES
(
  '上海陆家嘴禧玥酒店',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1740&q=80',
  '近外滩·东方明珠',
  '陆家嘴',
  936,
  4.8,
  '超棒',
  5,
  'approved',
  'BOSS:25楼是沪上知名米其林新荣记',
  JSON_ARRAY('免费停车', '健身房', 'WIFI'),
  JSON_ARRAY('上海美景酒店榜 No.16'),
  JSON_ARRAY(JSON_OBJECT('label','装修','value','2020'), JSON_OBJECT('label','风格','value','中式')),
  'merchant'
),
(
  '艺龙安悦酒店',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1625&q=80',
  '近歇浦路地铁站',
  '浦东新区',
  199,
  4.7,
  '超棒',
  4,
  'pending',
  '近歌浦路地铁站·LCM置汇旭辉广场',
  JSON_ARRAY('免费洗衣', '机器人服务'),
  JSON_ARRAY('性价比之选'),
  JSON_ARRAY(JSON_OBJECT('label','装修','value','2019'), JSON_OBJECT('label','风格','value','现代')),
  'merchant2'
);

INSERT INTO rooms (hotel_id, name, description, price, breakfast_included, refundable, bed_type)
VALUES
(1, '经典双床房', '2张1.2米单人床 | 40m²', 936, 0, 1, 'twin'),
(1, '豪华大床房', '1张2米大床 | 50m²', 1200, 1, 1, 'double'),
(2, '标准单人间', '1张1.5米床 | 30m²', 199, 0, 1, 'single'),
(2, '商务双床房', '2张1.2米床 | 45m²', 280, 1, 1, 'twin');

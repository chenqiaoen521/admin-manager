/*
 Navicat Premium Data Transfer

 Source Server         : 本机
 Source Server Type    : MySQL
 Source Server Version : 80013
 Source Host           : localhost:3306
 Source Schema         : yongdian

 Target Server Type    : MySQL
 Target Server Version : 80013
 File Encoding         : 65001

 Date: 11/12/2018 17:27:27
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for yd_users
-- ----------------------------
DROP TABLE IF EXISTS `yd_users`;
CREATE TABLE `yd_users`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `yd_role_id` int(11) NULL DEFAULT NULL,
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE,
  INDEX `yd_role_id`(`yd_role_id`) USING BTREE,
  CONSTRAINT `yd_users_ibfk_1` FOREIGN KEY (`yd_role_id`) REFERENCES `yd_roles` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of yd_users
-- ----------------------------
INSERT INTO `yd_users` VALUES (2, 'admin', '21232f297a57a5a743894a0e4a801fc3', 1, 1, '2018-09-12 08:28:08', '2018-12-11 08:41:39');

SET FOREIGN_KEY_CHECKS = 1;

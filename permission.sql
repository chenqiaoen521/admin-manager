/*
 Navicat Premium Data Transfer

 Source Server         : 公司
 Source Server Type    : MySQL
 Source Server Version : 50721
 Source Host           : 192.168.3.97:3307
 Source Schema         : kyappservermain

 Target Server Type    : MySQL
 Target Server Version : 50721
 File Encoding         : 65001

 Date: 06/12/2018 16:02:47
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for permission
-- ----------------------------
DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission`  (
  `permission_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '权限id',
  `permission_code` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '权限编号',
  `permission_uri` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '权限uri',
  `permission_name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '权限名称',
  `column_id` int(11) NULL DEFAULT NULL COMMENT '分栏id',
  `create_time` datetime(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  PRIMARY KEY (`permission_id`) USING BTREE,
  INDEX `permissionfk_column_id`(`column_id`) USING BTREE,
  CONSTRAINT `permissionfk_column_id` FOREIGN KEY (`column_id`) REFERENCES `column` (`column_id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;

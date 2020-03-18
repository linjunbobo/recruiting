/*
SQLyog Ultimate v12.09 (64 bit)
MySQL - 5.6.45 : Database - recruiting
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`recruiting` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `recruiting`;

/*Table structure for table `jobapply` */

DROP TABLE IF EXISTS `jobapply`;

CREATE TABLE `jobapply` (
  `jobApplyId` int(11) NOT NULL AUTO_INCREMENT COMMENT '职位申请表',
  `jobInfoId` int(11) DEFAULT NULL COMMENT '岗位Id',
  `resumbaseinfoId` int(11) DEFAULT NULL COMMENT '简历表',
  `state` int(11) DEFAULT NULL COMMENT '1 未处理，2，已读 3， 已通知，',
  PRIMARY KEY (`jobApplyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `jobinfo` */

DROP TABLE IF EXISTS `jobinfo`;

CREATE TABLE `jobinfo` (
  `jobInfoId` int(11) NOT NULL AUTO_INCREMENT COMMENT '岗位信息表',
  `company` varchar(255) DEFAULT NULL COMMENT '公司名',
  `position` varchar(255) DEFAULT NULL COMMENT '职位',
  `salary` varchar(255) DEFAULT NULL COMMENT '工资',
  `place` varchar(255) DEFAULT NULL COMMENT '工作地点',
  `workAge` varchar(255) DEFAULT NULL COMMENT '工作几年',
  `responsibility` varchar(255) DEFAULT NULL COMMENT '岗位职责',
  `requirement` varchar(255) DEFAULT NULL COMMENT '岗位要求',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`jobInfoId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Table structure for table `resumebaseinfo` */

DROP TABLE IF EXISTS `resumebaseinfo`;

CREATE TABLE `resumebaseinfo` (
  `resumeBaseInfoId` int(11) NOT NULL AUTO_INCREMENT COMMENT '简历Id',
  `userId` int(11) DEFAULT NULL COMMENT '用户ID',
  `name` varchar(255) DEFAULT NULL COMMENT '姓名',
  `birth` date DEFAULT NULL COMMENT '出生日期',
  `phone` varchar(255) DEFAULT NULL COMMENT '手机',
  `emile` varchar(255) DEFAULT NULL COMMENT '邮箱',
  `evaluation` varchar(255) DEFAULT NULL COMMENT '自我评价',
  `honor` varchar(255) DEFAULT NULL COMMENT '荣誉',
  `picture` varchar(255) DEFAULT NULL COMMENT '头像地址',
  PRIMARY KEY (`resumeBaseInfoId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Table structure for table `resumeeducation` */

DROP TABLE IF EXISTS `resumeeducation`;

CREATE TABLE `resumeeducation` (
  `resumeEducationId` int(11) NOT NULL AUTO_INCREMENT COMMENT '教育背景表ID',
  `school` varchar(255) CHARACTER SET latin1 DEFAULT NULL COMMENT '毕业院校',
  `startTime` date DEFAULT NULL COMMENT '开始时间',
  `endTime` date DEFAULT NULL COMMENT '结束时间',
  `profession` varchar(255) CHARACTER SET latin1 DEFAULT NULL COMMENT '专业',
  `resumeBaseInfoId` int(11) DEFAULT NULL COMMENT '简历基础表',
  PRIMARY KEY (`resumeEducationId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Table structure for table `resumework` */

DROP TABLE IF EXISTS `resumework`;

CREATE TABLE `resumework` (
  `resumeWorkId` int(11) NOT NULL AUTO_INCREMENT COMMENT '工作经历表',
  `company` varbinary(255) DEFAULT NULL COMMENT '公司名字',
  `resumeBaseInfoId` int(11) DEFAULT NULL COMMENT '简历表Id',
  `position` varchar(255) DEFAULT NULL COMMENT '职位',
  `work` varchar(255) DEFAULT NULL COMMENT '负责工作',
  `startTime` date DEFAULT NULL COMMENT '开始时间',
  `endTime` date DEFAULT NULL COMMENT '结束时间',
  PRIMARY KEY (`resumeWorkId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `userId` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户Id',
  `phone` varchar(255) DEFAULT NULL COMMENT '手机',
  `password` varchar(255) DEFAULT NULL COMMENT '密码',
  `type` int(11) DEFAULT NULL COMMENT '1.求职责 2.职位提供者 3.系统管理员',
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

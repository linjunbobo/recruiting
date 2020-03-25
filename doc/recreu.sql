/*
SQLyog Professional v12.09 (64 bit)
MySQL - 5.5.24 : Database - recruiting
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
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`jobApplyId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `jobapply` */

insert  into `jobapply`(`jobApplyId`,`jobInfoId`,`resumbaseinfoId`,`state`,`updateTime`) values (5,6,6,1,'2020-03-25 20:01:45'),(6,5,6,1,'2020-03-25 20:01:49');

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
  `education` varchar(255) DEFAULT NULL COMMENT '学历要求',
  PRIMARY KEY (`jobInfoId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `jobinfo` */

insert  into `jobinfo`(`jobInfoId`,`company`,`position`,`salary`,`place`,`workAge`,`responsibility`,`requirement`,`updateTime`,`education`) values (5,'伯威部门','伯威的职位','12k','脉动','2','切尔沃普阿松跑得快岸炮 哦啊PK阿婆看哦怕卡','都怕死恐怕看从西欧作品恐怕辛苦哦评测中心看从在自行车','2020-03-25 19:57:50','无'),(6,'撒旦','打算','12K','12撒旦','2','欧派我去叫哦啊苏东坡恐怕思考迫使恐怕哦啊破案松平导视牌恐怕控制下欧派恐怕出口破产v可惜从旁v看破产辛苦v哦平常心','偶的思考片刻从破佛佩佩看vPSP的Fiji就的身份vx','2020-03-25 19:59:30','无打算');

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

/*Data for the table `resumebaseinfo` */

insert  into `resumebaseinfo`(`resumeBaseInfoId`,`userId`,`name`,`birth`,`phone`,`emile`,`evaluation`,`honor`,`picture`) values (5,6,'伯威','2020-02-02','13712072402','21321932913@qq.com','速度快河口处在进行 2020-02\n阿三顶顶  昂斯 2032-12','速度快河口处在进行 2020-02\n阿三顶顶  昂斯 2032-12','/uploads/u=4039512707,2521230538&fm=26&gp=0.jpg'),(6,19,'bowei','2019-02-01','12312392193','213123213@qq.com','就ask立即打开拉萨觉得卢卡斯克拉记录卡刻录机 2020-02\n实大  啊是大  昂斯 啊是大 2012-03','就ask立即打开拉萨觉得卢卡斯克拉记录卡刻录机 2020-02\n实大  啊是大  昂斯 啊是大 2012-03','/uploads/u=4039512707,2521230538&fm=26&gp=0.jpg');

/*Table structure for table `resumeeducation` */

DROP TABLE IF EXISTS `resumeeducation`;

CREATE TABLE `resumeeducation` (
  `resumeEducationId` int(11) NOT NULL AUTO_INCREMENT COMMENT '教育背景表ID',
  `school` varchar(255) DEFAULT NULL COMMENT '毕业院校',
  `startTime` date DEFAULT NULL COMMENT '开始时间',
  `endTime` date DEFAULT NULL COMMENT '结束时间',
  `profession` varchar(255) DEFAULT NULL COMMENT '专业',
  `resumeBaseInfoId` int(11) DEFAULT NULL COMMENT '简历基础表',
  `time` varchar(255) DEFAULT NULL COMMENT '时间',
  PRIMARY KEY (`resumeEducationId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

/*Data for the table `resumeeducation` */

insert  into `resumeeducation`(`resumeEducationId`,`school`,`startTime`,`endTime`,`profession`,`resumeBaseInfoId`,`time`) values (10,'广外',NULL,NULL,'新馆',6,'2020-02');

/*Table structure for table `resumework` */

DROP TABLE IF EXISTS `resumework`;

CREATE TABLE `resumework` (
  `resumeWorkId` int(11) NOT NULL AUTO_INCREMENT COMMENT '工作经历表',
  `company` varchar(255) DEFAULT NULL COMMENT '公司名字',
  `resumeBaseInfoId` int(11) DEFAULT NULL COMMENT '简历表Id',
  `position` varchar(255) DEFAULT NULL COMMENT '职位',
  `work` varchar(255) DEFAULT NULL COMMENT '负责工作',
  `startTime` date DEFAULT NULL COMMENT '开始时间',
  `endTime` date DEFAULT NULL COMMENT '结束时间',
  `time` varchar(255) DEFAULT NULL COMMENT '时间',
  PRIMARY KEY (`resumeWorkId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

/*Data for the table `resumework` */

insert  into `resumework`(`resumeWorkId`,`company`,`resumeBaseInfoId`,`position`,`work`,`startTime`,`endTime`,`time`) values (10,'文档',5,'啊是大','大师的客场表现正常',NULL,NULL,'2022-2021'),(11,'阿瑟东撒的',6,'啊是大','爱说大话现场看了就看了按时交付了',NULL,NULL,'2029-2091');

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `userId` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户Id',
  `phone` varchar(255) DEFAULT NULL COMMENT '手机',
  `password` varchar(255) DEFAULT NULL COMMENT '密码',
  `type` int(11) DEFAULT NULL COMMENT '1.求职责 2.职位提供者 3.系统管理员',
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

/*Data for the table `user` */

insert  into `user`(`userId`,`phone`,`password`,`type`) values (1,'admin','admin',3),(19,'asd','asd',1),(20,'123','123',1);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

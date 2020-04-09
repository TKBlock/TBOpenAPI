-- --------------------------------------------------------
-- 호스트:                          49.50.165.230
-- 서버 버전:                        10.3.22-MariaDB-1:10.3.22+maria~xenial-log - mariadb.org binary distribution
-- 서버 OS:                        debian-linux-gnu
-- HeidiSQL 버전:                  9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- taekwonblock 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `taekwonblock` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `taekwonblock`;

-- 테이블 taekwonblock.assn_dojo 구조 내보내기
CREATE TABLE IF NOT EXISTS `assn_dojo` (
  `IDX` int(11) NOT NULL AUTO_INCREMENT,
  `assn_uuid` text NOT NULL,
  `dojo_uuid` text NOT NULL,
  `assosiated_date` datetime DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`IDX`),
  UNIQUE KEY `assn_uuid_dojo_uuid` (`assn_uuid`(255),`dojo_uuid`(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='협회 소속 도장 테이블';

-- 내보낼 데이터가 선택되어 있지 않습니다.
-- 테이블 taekwonblock.assosiation 구조 내보내기
CREATE TABLE IF NOT EXISTS `assosiation` (
  `IDX` int(11) NOT NULL AUTO_INCREMENT,
  `web_user_uuid` text NOT NULL DEFAULT '0',
  `assn_name` text NOT NULL,
  `manager` text NOT NULL,
  `address` text NOT NULL,
  `image1` text DEFAULT '0',
  `image2` text DEFAULT '0',
  `image3` text DEFAULT '0',
  `image4` text DEFAULT '0',
  `image5` text DEFAULT '0',
  `description` text DEFAULT '0',
  `phone` text DEFAULT NULL,
  `found_date` date NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`IDX`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='협회';

-- 내보낼 데이터가 선택되어 있지 않습니다.
-- 테이블 taekwonblock.career 구조 내보내기
CREATE TABLE IF NOT EXISTS `career` (
  `IDX` int(11) NOT NULL AUTO_INCREMENT,
  `user_uuid` text NOT NULL DEFAULT '0',
  `dojo_uuid` text NOT NULL,
  `state` int(11) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  PRIMARY KEY (`IDX`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='사범의 도장 근무 이력';

-- 내보낼 데이터가 선택되어 있지 않습니다.
-- 테이블 taekwonblock.certificate 구조 내보내기
CREATE TABLE IF NOT EXISTS `certificate` (
  `IDX` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` text NOT NULL,
  `cert_name` text NOT NULL,
  `image1` text DEFAULT NULL,
  `image2` text DEFAULT NULL,
  `image3` text DEFAULT NULL,
  `image4` text DEFAULT NULL,
  `image5` text DEFAULT NULL,
  PRIMARY KEY (`IDX`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COMMENT='자격/급/단증 정보';

-- 내보낼 데이터가 선택되어 있지 않습니다.
-- 테이블 taekwonblock.course 구조 내보내기
CREATE TABLE IF NOT EXISTS `course` (
  `IDX` int(11) NOT NULL AUTO_INCREMENT,
  `dojo_uuid` text NOT NULL DEFAULT '0',
  `course_name` text NOT NULL,
  `manager` text NOT NULL,
  `image1` text DEFAULT NULL,
  `image2` text DEFAULT NULL,
  `image3` text DEFAULT NULL,
  `image4` text DEFAULT NULL,
  `image5` text DEFAULT NULL,
  `description` text NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`IDX`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8 COMMENT='개설과정';

-- 내보낼 데이터가 선택되어 있지 않습니다.
-- 테이블 taekwonblock.dojo 구조 내보내기
CREATE TABLE IF NOT EXISTS `dojo` (
  `IDX` int(11) NOT NULL AUTO_INCREMENT,
  `web_user_uuid` text NOT NULL DEFAULT '0',
  `dojo_name` text NOT NULL,
  `manager` text NOT NULL,
  `address` text DEFAULT NULL,
  `image1` text DEFAULT NULL,
  `image2` text DEFAULT NULL,
  `image3` text DEFAULT NULL,
  `image4` text DEFAULT NULL,
  `image5` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `phone` text DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`IDX`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='도장';

-- 내보낼 데이터가 선택되어 있지 않습니다.
-- 테이블 taekwonblock.enrollment 구조 내보내기
CREATE TABLE IF NOT EXISTS `enrollment` (
  `IDX` int(11) NOT NULL AUTO_INCREMENT,
  `course_IDX` int(11) NOT NULL,
  `dojo_uuid` text NOT NULL,
  `user_uuid` text NOT NULL,
  `state` int(11) NOT NULL,
  `fixed_name` tinytext DEFAULT NULL,
  `registered_date` datetime DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `removed_date` datetime DEFAULT NULL,
  PRIMARY KEY (`IDX`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.
-- 테이블 taekwonblock.fitness 구조 내보내기
CREATE TABLE IF NOT EXISTS `fitness` (
  `IDX` int(11) NOT NULL AUTO_INCREMENT,
  `user_idx` int(11) NOT NULL,
  `height` double DEFAULT NULL,
  `weight` double DEFAULT NULL,
  `blood_pressure` int(11) DEFAULT NULL,
  `BMI` double DEFAULT NULL,
  PRIMARY KEY (`IDX`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='수련생의 신체정보';

-- 내보낼 데이터가 선택되어 있지 않습니다.
-- 테이블 taekwonblock.history 구조 내보내기
CREATE TABLE IF NOT EXISTS `history` (
  `IDX` int(11) NOT NULL AUTO_INCREMENT,
  `user_uuid` text NOT NULL,
  `dojo_uuid` text NOT NULL,
  `state` int(11) DEFAULT NULL,
  `registered_date` datetime DEFAULT NULL,
  `finished_date` datetime DEFAULT NULL,
  PRIMARY KEY (`IDX`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='수련생이 수강한 과정 이력';

-- 내보낼 데이터가 선택되어 있지 않습니다.
-- 테이블 taekwonblock.instructor 구조 내보내기
CREATE TABLE IF NOT EXISTS `instructor` (
  `IDX` int(11) NOT NULL AUTO_INCREMENT,
  `mobile_user_uuid` text NOT NULL,
  `name` text NOT NULL,
  `age` int(11) NOT NULL,
  `address` text NOT NULL,
  `phone` text NOT NULL,
  PRIMARY KEY (`IDX`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='사범';

-- 내보낼 데이터가 선택되어 있지 않습니다.
-- 테이블 taekwonblock.issuance 구조 내보내기
CREATE TABLE IF NOT EXISTS `issuance` (
  `IDX` int(11) NOT NULL AUTO_INCREMENT,
  `assn_uuid` text NOT NULL,
  `dojo_uuid` text NOT NULL,
  `user_uuid` text NOT NULL,
  `issue_name` text NOT NULL,
  `message` text DEFAULT NULL,
  `state` int(11) NOT NULL DEFAULT 0,
  `request_date` datetime DEFAULT NULL,
  `issue_date` datetime DEFAULT NULL,
  PRIMARY KEY (`IDX`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.
-- 테이블 taekwonblock.mobile_user 구조 내보내기
CREATE TABLE IF NOT EXISTS `mobile_user` (
  `IDX` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` text NOT NULL,
  `account_type` int(11) NOT NULL,
  `openid` text NOT NULL COMMENT 'google에서는 Email',
  `unionid` text NOT NULL COMMENT 'google에서는 ID',
  `registration_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_login_date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`IDX`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.
-- 테이블 taekwonblock.student 구조 내보내기
CREATE TABLE IF NOT EXISTS `student` (
  `IDX` int(11) NOT NULL AUTO_INCREMENT,
  `mobile_user_uuid` text NOT NULL,
  `name` text NOT NULL,
  `age` int(11) NOT NULL,
  `address` text NOT NULL,
  `phone` text NOT NULL,
  PRIMARY KEY (`IDX`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='수련생';

-- 내보낼 데이터가 선택되어 있지 않습니다.
-- 테이블 taekwonblock.training 구조 내보내기
CREATE TABLE IF NOT EXISTS `training` (
  `IDX` int(11) NOT NULL AUTO_INCREMENT,
  `user_uuid` text NOT NULL DEFAULT '0',
  `dojo_uuid` text NOT NULL DEFAULT '0',
  `state` int(11) DEFAULT NULL,
  `registered_date` datetime DEFAULT NULL,
  `finished_date` datetime DEFAULT NULL,
  PRIMARY KEY (`IDX`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='수련생이 수련중인 도장';

-- 내보낼 데이터가 선택되어 있지 않습니다.
-- 테이블 taekwonblock.web_user 구조 내보내기
CREATE TABLE IF NOT EXISTS `web_user` (
  `IDX` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` text NOT NULL,
  `account_type` int(11) NOT NULL DEFAULT 0,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `registration_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_login_date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`IDX`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='웹 계정 정보(도장 / 협회)';

-- 내보낼 데이터가 선택되어 있지 않습니다.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

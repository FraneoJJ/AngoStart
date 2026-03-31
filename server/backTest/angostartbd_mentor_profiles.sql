-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: angostartbd
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `mentor_profiles`
--

DROP TABLE IF EXISTS `mentor_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mentor_profiles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `phone` varchar(30) NOT NULL,
  `identity_number` varchar(30) NOT NULL,
  `birth_date` date NOT NULL,
  `province` varchar(120) NOT NULL,
  `expertise_area` varchar(120) NOT NULL,
  `experience_years` int NOT NULL,
  `company` varchar(180) NOT NULL,
  `current_role` varchar(180) NOT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `bi_front_doc` varchar(255) NOT NULL,
  `cv_doc` varchar(255) DEFAULT NULL,
  `certificate_doc` varchar(255) DEFAULT NULL,
  `declare_truth` tinyint(1) NOT NULL DEFAULT '0',
  `accept_terms` tinyint(1) NOT NULL DEFAULT '0',
  `verification_id` varchar(40) NOT NULL,
  `verification_status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mentor_profiles`
--

LOCK TABLES `mentor_profiles` WRITE;
/*!40000 ALTER TABLE `mentor_profiles` DISABLE KEYS */;
INSERT INTO `mentor_profiles` VALUES (1,6,'923456781','123456789LA0','1990-01-01','luanda','gestao',5,'Empresa X','Gestor',NULL,'bi.pdf','cv.pdf',NULL,1,1,'VER-M-MMDKMMLG','approved','2026-03-05 14:38:49','2026-03-06 15:32:41'),(2,8,'921106010','039485776LA039','2004-02-06','luanda','gestao',3,'Gedom','PCA',NULL,'? TERMOS E CONDIÇÕES DE USO.pdf','? TERMOS E CONDIÇÕES DE USO.pdf','? TERMOS E CONDIÇÕES DE USO.pdf',1,1,'VER-M-MMSZVRIR','approved','2026-03-16 09:42:23','2026-03-16 10:07:21'),(3,3,'923000001','111111113BA0','1990-01-01','luanda','estrategia',5,'Empresa Mentor 3','Consultor',NULL,'bi-mentor-3.pdf','cv-mentor-3.pdf',NULL,1,1,'VER-M-AUTO-3','approved','2026-03-16 13:06:06','2026-03-16 13:06:06');
/*!40000 ALTER TABLE `mentor_profiles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-31 14:40:49

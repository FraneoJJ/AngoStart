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
-- Table structure for table `investidor_profiles`
--

DROP TABLE IF EXISTS `investidor_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `investidor_profiles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `phone` varchar(30) NOT NULL,
  `identity_number` varchar(30) NOT NULL,
  `province` varchar(120) NOT NULL,
  `investor_type` enum('individual','empresa') NOT NULL,
  `profession` varchar(180) DEFAULT NULL,
  `income_source` varchar(180) DEFAULT NULL,
  `investment_range` varchar(120) DEFAULT NULL,
  `company_name` varchar(180) DEFAULT NULL,
  `company_nif` varchar(40) DEFAULT NULL,
  `company_role` varchar(180) DEFAULT NULL,
  `has_investment_experience` enum('sim','nao') DEFAULT NULL,
  `investment_experience_area` varchar(180) DEFAULT NULL,
  `linkedin_or_website` varchar(255) DEFAULT NULL,
  `bi_front_doc` varchar(255) NOT NULL,
  `company_certificate_doc` varchar(255) DEFAULT NULL,
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
-- Dumping data for table `investidor_profiles`
--

LOCK TABLES `investidor_profiles` WRITE;
/*!40000 ALTER TABLE `investidor_profiles` DISABLE KEYS */;
INSERT INTO `investidor_profiles` VALUES (1,9,'955300287','008877445AR098','uige','individual','Professora','Salário ','500k-2m','Gedom',NULL,'CEO','sim','Educação',NULL,'Relatorio de visitas Tel Net.pdf',NULL,1,1,'VER-I-MMGPAAML','approved','2026-03-07 19:12:31','2026-03-16 12:05:25'),(2,11,'923456789','123456789LA042','luanda','individual','Empresario','Negocio','2m-10m',NULL,NULL,NULL,NULL,NULL,NULL,'bi.pdf',NULL,1,1,'VER-I-MMJ6RDQQ','approved','2026-03-09 12:57:14','2026-03-16 12:16:44'),(3,1,'923000002','222222221BA0','luanda','individual','Empresario','negocios','500000-2000000',NULL,NULL,NULL,'sim','startups',NULL,'bi-investidor-1.pdf',NULL,1,1,'VER-I-AUTO-1','approved','2026-03-16 13:06:06','2026-03-16 13:06:06');
/*!40000 ALTER TABLE `investidor_profiles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-31 14:40:48

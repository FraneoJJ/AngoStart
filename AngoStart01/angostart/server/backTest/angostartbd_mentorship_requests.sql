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
-- Table structure for table `mentorship_requests`
--

DROP TABLE IF EXISTS `mentorship_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mentorship_requests` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `entrepreneur_user_id` bigint unsigned NOT NULL,
  `mentor_user_id` bigint unsigned NOT NULL,
  `idea_id` bigint unsigned DEFAULT NULL,
  `topic` varchar(180) NOT NULL,
  `session_type` enum('online','presencial') NOT NULL DEFAULT 'online',
  `preferred_datetime` datetime NOT NULL,
  `duration_minutes` int NOT NULL DEFAULT '60',
  `payment_method` enum('multicaixa','transferencia','unitel-money','afrimoney') NOT NULL,
  `price_kz` decimal(14,2) NOT NULL DEFAULT '0.00',
  `status` enum('pending','accepted','rejected','completed') NOT NULL DEFAULT 'pending',
  `entrepreneur_notes` text,
  `mentor_notes` text,
  `mentor_response_at` datetime DEFAULT NULL,
  `scheduled_for` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_mr_entrepreneur` (`entrepreneur_user_id`),
  KEY `idx_mr_mentor` (`mentor_user_id`),
  KEY `idx_mr_status` (`status`),
  KEY `idx_mr_datetime` (`preferred_datetime`),
  KEY `fk_mr_idea` (`idea_id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mentorship_requests`
--

LOCK TABLES `mentorship_requests` WRITE;
/*!40000 ALTER TABLE `mentorship_requests` DISABLE KEYS */;
INSERT INTO `mentorship_requests` VALUES (1,2,6,NULL,'Sessão de mentoria com foco em gestao','online','2026-03-13 01:50:00',30,'multicaixa',5000.00,'pending',NULL,NULL,NULL,'2026-03-13 01:50:00','2026-03-14 22:45:03','2026-03-14 22:45:03'),(2,8,6,NULL,'Sessão de mentoria com foco em gestao','presencial','2026-03-03 09:17:00',90,'transferencia',15000.00,'pending',NULL,NULL,NULL,'2026-03-03 09:17:00','2026-03-16 08:18:20','2026-03-16 08:18:20'),(3,8,6,NULL,'Sessão de mentoria com foco em gestao','online','2026-03-05 09:21:00',30,'multicaixa',5000.00,'pending','Fui rejeitado',NULL,NULL,'2026-03-05 09:21:00','2026-03-16 08:22:12','2026-03-16 08:22:12'),(4,8,8,NULL,'Sessão de mentoria com foco em gestao','online','2026-03-18 11:15:00',30,'transferencia',5000.00,'accepted',NULL,NULL,'2026-03-16 11:17:09','2026-03-17 13:20:00','2026-03-16 10:15:21','2026-03-16 10:17:09'),(5,8,8,NULL,'Sessão de mentoria com foco em gestao','online','2026-03-20 11:30:00',60,'multicaixa',10000.00,'accepted',NULL,NULL,'2026-03-16 11:31:11','2026-03-20 11:30:00','2026-03-16 10:30:33','2026-03-16 10:31:11'),(6,10,3,NULL,'Sessão de mentoria com foco em estrategia','presencial','2026-03-17 14:33:00',60,'transferencia',10000.00,'pending',NULL,NULL,NULL,'2026-03-17 14:33:00','2026-03-16 13:35:00','2026-03-16 13:35:00'),(7,2,3,NULL,'Sessão de mentoria com foco em estrategia','online','2026-03-18 17:00:00',60,'transferencia',10000.00,'pending','teste',NULL,NULL,'2026-03-18 17:00:00','2026-03-17 16:00:27','2026-03-17 16:00:27'),(8,2,3,NULL,'Sessão de mentoria com foco em estrategia','online','2026-03-25 20:01:00',30,'transferencia',5000.00,'pending','Nada com nada',NULL,NULL,'2026-03-25 20:01:00','2026-03-17 16:01:53','2026-03-17 16:01:53');
/*!40000 ALTER TABLE `mentorship_requests` ENABLE KEYS */;
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

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
-- Table structure for table `strategic_checklist_progress`
--

DROP TABLE IF EXISTS `strategic_checklist_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `strategic_checklist_progress` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `idea_id` bigint unsigned DEFAULT NULL,
  `step_key` varchar(120) NOT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT '0',
  `notes` text,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_strategic_progress` (`user_id`,`idea_id`,`step_key`),
  KEY `fk_scp_idea` (`idea_id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `strategic_checklist_progress`
--

LOCK TABLES `strategic_checklist_progress` WRITE;
/*!40000 ALTER TABLE `strategic_checklist_progress` DISABLE KEYS */;
INSERT INTO `strategic_checklist_progress` VALUES (1,8,NULL,'validar_problema_cliente',1,NULL,'2026-03-09 13:08:16','2026-03-09 13:08:16','2026-03-09 13:08:16'),(2,8,NULL,'validar_problema_cliente',0,NULL,NULL,'2026-03-09 13:08:17','2026-03-09 13:08:17'),(3,8,NULL,'validar_problema_cliente',1,NULL,'2026-03-09 13:08:19','2026-03-09 13:08:19','2026-03-09 13:08:19'),(4,8,NULL,'definir_segmento_alvo',1,NULL,'2026-03-09 13:08:21','2026-03-09 13:08:20','2026-03-09 13:08:20'),(5,8,NULL,'testar_proposta_valor',1,NULL,'2026-03-09 13:08:24','2026-03-09 13:08:23','2026-03-09 13:08:23'),(6,8,NULL,'desenhar_mvp',1,NULL,'2026-03-09 13:08:30','2026-03-09 13:08:29','2026-03-09 13:08:29'),(7,8,NULL,'plano_financeiro_90dias',1,NULL,'2026-03-09 13:08:54','2026-03-09 13:08:53','2026-03-09 13:08:53'),(8,2,NULL,'validar_problema_cliente',1,NULL,'2026-03-10 22:28:26','2026-03-10 22:28:25','2026-03-10 22:28:25'),(9,2,NULL,'otimizar_aquisicao',1,NULL,'2026-03-10 22:34:41','2026-03-10 22:34:41','2026-03-10 22:34:41');
/*!40000 ALTER TABLE `strategic_checklist_progress` ENABLE KEYS */;
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

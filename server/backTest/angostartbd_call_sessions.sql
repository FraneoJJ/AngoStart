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
-- Table structure for table `call_sessions`
--

DROP TABLE IF EXISTS `call_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `call_sessions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `channel_name` varchar(200) NOT NULL,
  `caller_id` bigint unsigned NOT NULL,
  `receiver_id` bigint unsigned NOT NULL,
  `call_type` enum('video','voice') NOT NULL DEFAULT 'video',
  `status` enum('invited','accepted','rejected','ended','missed') NOT NULL DEFAULT 'invited',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `accepted_at` datetime DEFAULT NULL,
  `ended_at` datetime DEFAULT NULL,
  `ended_by_user_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `channel_name` (`channel_name`),
  KEY `idx_call_channel` (`channel_name`),
  KEY `idx_call_caller` (`caller_id`),
  KEY `idx_call_receiver` (`receiver_id`),
  KEY `idx_call_status` (`status`),
  KEY `fk_call_ended_by` (`ended_by_user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `call_sessions`
--

LOCK TABLES `call_sessions` WRITE;
/*!40000 ALTER TABLE `call_sessions` DISABLE KEYS */;
INSERT INTO `call_sessions` VALUES (1,'angostart-6-1773670190884',2,6,'voice','ended','2026-03-16 14:09:50',NULL,'2026-03-16 15:10:32',2),(2,'angostart-6-1773670246096',2,6,'voice','ended','2026-03-16 14:10:46','2026-03-16 15:10:55','2026-03-16 15:11:40',6),(3,'angostart-6-1773670307600',2,6,'video','ended','2026-03-16 14:11:47','2026-03-16 15:11:56','2026-03-16 15:12:41',6),(4,'angostart-6-1773674851524',2,6,'voice','ended','2026-03-16 15:27:31',NULL,'2026-03-16 16:27:33',2),(5,'angostart-2-1773675699521',1,2,'voice','ended','2026-03-16 15:41:39',NULL,'2026-03-16 16:41:41',1),(6,'angostart-2-1773675703057',1,2,'video','ended','2026-03-16 15:41:43',NULL,'2026-03-16 16:41:50',1),(7,'angostart-1-1773699708521',2,1,'voice','invited','2026-03-16 22:21:48',NULL,NULL,NULL),(8,'angostart-1-1773699741119',2,1,'voice','accepted','2026-03-16 22:22:21','2026-03-16 23:22:26',NULL,NULL),(9,'angostart-2-1773742996531',1,2,'voice','accepted','2026-03-17 10:23:16','2026-03-17 11:23:19',NULL,NULL),(10,'angostart-1-1773744451295',2,1,'voice','accepted','2026-03-17 10:47:31','2026-03-17 11:47:34',NULL,NULL),(11,'angostart-2-1773747186765',1,2,'voice','ended','2026-03-17 11:33:06',NULL,'2026-03-17 12:33:17',1),(12,'angostart-2-1773747200626',1,2,'voice','ended','2026-03-17 11:33:20','2026-03-17 12:33:23','2026-03-17 12:33:36',1),(13,'angostart-2-1773747218386',1,2,'video','ended','2026-03-17 11:33:38','2026-03-17 12:33:43','2026-03-17 12:34:03',2),(14,'angostart-1-1773747756086',2,1,'voice','ended','2026-03-17 11:42:36','2026-03-17 12:42:42','2026-03-17 12:43:25',2),(15,'angostart-1-1773747919548',2,1,'voice','ended','2026-03-17 11:45:19','2026-03-17 12:45:24','2026-03-17 12:45:49',1),(16,'angostart-1-1774437088226',2,1,'voice','rejected','2026-03-25 11:11:28',NULL,'2026-03-25 12:11:38',1),(17,'angostart-13-1774453627778',14,13,'voice','ended','2026-03-25 15:47:07',NULL,'2026-03-25 16:47:14',14);
/*!40000 ALTER TABLE `call_sessions` ENABLE KEYS */;
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

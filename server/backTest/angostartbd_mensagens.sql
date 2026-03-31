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
-- Table structure for table `mensagens`
--

DROP TABLE IF EXISTS `mensagens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mensagens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sender_id` bigint unsigned NOT NULL,
  `receiver_id` bigint unsigned NOT NULL,
  `message` text NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lida` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_msg_sender` (`sender_id`),
  KEY `idx_msg_receiver` (`receiver_id`),
  KEY `idx_msg_time` (`timestamp`)
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensagens`
--

LOCK TABLES `mensagens` WRITE;
/*!40000 ALTER TABLE `mensagens` DISABLE KEYS */;
INSERT INTO `mensagens` VALUES (1,3,10,'Ola Multi User','2026-03-16 14:37:13',1),(2,10,3,'Sra. Ana boa tarde','2026-03-16 14:38:20',1),(3,3,10,'Como estás?','2026-03-16 14:38:40',1),(4,10,3,'Bem e a Sra?','2026-03-16 14:39:00',1),(5,3,10,'Bem como é que vamos organizar a nossa agenda?','2026-03-16 14:41:04',1),(6,1,8,'Ola Franeo','2026-03-16 16:41:11',1),(7,1,2,'Olá Sparck','2026-03-16 16:41:28',1),(8,2,1,'Olá Pedro','2026-03-17 12:00:59',1),(9,2,1,'Como estás?','2026-03-17 12:01:10',1),(10,2,3,'Ola senhora Ana','2026-03-17 17:34:33',1),(11,2,3,'ALmejo que estejas bem','2026-03-17 17:34:42',1),(12,2,11,'Boa tarde Multi User, gostaria de lhe fazer uma proposta','2026-03-24 16:21:48',0),(13,2,9,'Testando','2026-03-24 16:22:13',0),(14,2,9,'Gostaria de lhe fazer uma proposta','2026-03-24 16:22:28',0),(15,1,2,'How are you?','2026-03-24 16:26:38',1),(16,2,1,'Am ok Boss','2026-03-24 16:26:51',1),(17,1,2,'Very good','2026-03-24 16:27:00',1),(18,2,1,'I need the space','2026-03-24 16:27:20',1),(19,1,2,'Ohh ok no problem','2026-03-24 16:27:33',1),(20,2,3,'Ola Ana','2026-03-25 12:20:07',0),(21,14,13,'É como mano?','2026-03-25 16:42:34',0);
/*!40000 ALTER TABLE `mensagens` ENABLE KEYS */;
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

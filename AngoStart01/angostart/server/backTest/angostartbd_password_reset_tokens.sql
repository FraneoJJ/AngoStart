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
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `token_hash` char(64) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_password_reset_token_hash` (`token_hash`),
  KEY `idx_password_reset_user` (`user_id`),
  KEY `idx_password_reset_expires` (`expires_at`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
INSERT INTO `password_reset_tokens` VALUES (1,8,'de1f50c874f6328de079adb68c72bfd568c3edd6494862c3651d1bf1f24cbeca','2026-03-13 13:18:19','2026-03-13 12:49:43','2026-03-13 11:48:19'),(2,8,'64ed52a1431be87c2912d8fe60fc435c7c0e534aa22967a6f9ba6f3a377a0d62','2026-03-13 13:19:44',NULL,'2026-03-13 11:49:43'),(3,8,'c8f169824de12563284354d8fedfcf5f57290a3a305e7fcadd8d6fa96c307656','2026-03-13 14:31:24','2026-03-13 14:18:12','2026-03-13 13:01:24'),(4,8,'a0d1f923d29b78c6b27bab8f3db1b4d259a9f07451d3c89d7806aeebeeeef32d','2026-03-13 14:48:13','2026-03-13 14:18:40','2026-03-13 13:18:12'),(5,8,'af2f4ddfd9c06bed85f99ca16b7bb2e4b458238ecad2f04aad603bcab674873d','2026-03-13 14:48:41','2026-03-13 14:21:07','2026-03-13 13:18:40'),(6,8,'76d14f5f0bba5dd243b1ef23a2f2afde3560fb32801b64007213ef5cb92b0f31','2026-03-13 14:51:08','2026-03-13 14:22:28','2026-03-13 13:21:07'),(7,8,'5befe54c11a3bdc35c0c21a53d0ff66285bb38fba358d76cf8f1ad9e62d97113','2026-03-13 14:52:29','2026-03-13 14:24:00','2026-03-13 13:22:28'),(8,8,'b748f8359dce8242900012a9b4b41be43a043089b32a8dada9675e6dc0fd04f8','2026-03-13 15:01:09',NULL,'2026-03-13 13:31:09');
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
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

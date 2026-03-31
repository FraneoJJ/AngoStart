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
-- Table structure for table `legal_company_guides`
--

DROP TABLE IF EXISTS `legal_company_guides`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `legal_company_guides` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `idea_id` bigint unsigned DEFAULT NULL,
  `business_sector` varchar(120) DEFAULT NULL,
  `partner_count` int NOT NULL DEFAULT '1',
  `estimated_monthly_revenue` decimal(14,2) NOT NULL DEFAULT '0.00',
  `has_foreign_partner` tinyint(1) NOT NULL DEFAULT '0',
  `recommended_type` enum('ENI','LDA','SA') NOT NULL,
  `estimated_opening_days` int NOT NULL,
  `estimated_cost_aoa` decimal(14,2) NOT NULL,
  `notes` text,
  `result_json` json NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_lcg_user` (`user_id`),
  KEY `fk_lcg_idea` (`idea_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `legal_company_guides`
--

LOCK TABLES `legal_company_guides` WRITE;
/*!40000 ALTER TABLE `legal_company_guides` DISABLE KEYS */;
INSERT INTO `legal_company_guides` VALUES (1,2,NULL,'tebib',1,34566.00,0,'ENI',10,120000.00,'kjbibl','{\"reasons\": [\"Estrutura simples e rápida para iniciar operação.\"], \"disclaimer\": \"Estimativas orientativas; confirme taxas e requisitos atualizados junto dos órgãos competentes.\", \"nextActions\": [\"Validar nome da empresa no GUCE.\", \"Preparar estatuto social com objeto e quotas.\", \"Concluir registo fiscal e enquadramento na AGT.\", \"Obter licenças específicas do setor antes de operar.\"], \"recommendedType\": \"ENI\", \"estimatedCostAoa\": 120000, \"requiredDocuments\": [\"Cópia do BI/Passaporte dos sócios\", \"NIF dos sócios e da entidade\", \"Certidão de admissibilidade do nome\", \"Estatutos/acto constitutivo\", \"Comprovativo de morada da sede\", \"Registo comercial e publicação\", \"Inscrição no INSS\"], \"estimatedOpeningDays\": 10}','2026-03-10 22:37:36','2026-03-10 22:37:36');
/*!40000 ALTER TABLE `legal_company_guides` ENABLE KEYS */;
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

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
-- Table structure for table `viability_reports`
--

DROP TABLE IF EXISTS `viability_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `viability_reports` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `idea_id` bigint unsigned DEFAULT NULL,
  `session_id` bigint unsigned DEFAULT NULL,
  `viability_status` enum('viavel','inviavel') NOT NULL,
  `score` int NOT NULL,
  `strengths_json` json NOT NULL,
  `weaknesses_json` json NOT NULL,
  `adjustments_json` json NOT NULL,
  `summary` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_vr_idea` (`idea_id`),
  KEY `fk_vr_session` (`session_id`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `viability_reports`
--

LOCK TABLES `viability_reports` WRITE;
/*!40000 ALTER TABLE `viability_reports` DISABLE KEYS */;
INSERT INTO `viability_reports` VALUES (1,5,4,'inviavel',47,'[\"Diferencial competitivo identificado.\", \"Existe capital inicial para validação.\", \"Contexto geográfico de atuação informado.\"]','[\"Definição de problema ainda superficial.\", \"Público-alvo não segmentado.\", \"Questionário estratégico não preenchido.\"]','[\"Aprofundar a dor do cliente com entrevistas locais.\", \"Segmentar cliente ideal por perfil, renda e localização.\", \"Gerar e responder questionário dinâmico antes de escalar a ideia.\"]','A ideia precisa de ajustes estratégicos antes de avançar para execução.','2026-03-13 13:59:35','2026-03-13 13:59:35'),(2,6,11,'inviavel',25,'[\"Existe capital inicial para validação.\", \"Contexto geográfico de atuação informado.\"]','[\"Definição de problema ainda superficial.\", \"Diferencial competitivo pouco claro.\", \"Público-alvo não segmentado.\", \"Questionário estratégico não preenchido.\"]','[\"Aprofundar a dor do cliente com entrevistas locais.\", \"Definir proposta de valor única frente aos concorrentes.\", \"Segmentar cliente ideal por perfil, renda e localização.\", \"Gerar e responder questionário dinâmico antes de escalar a ideia.\"]','A ideia precisa de ajustes estratégicos antes de avançar para execução.','2026-03-13 15:09:39','2026-03-13 15:09:39'),(3,7,12,'inviavel',25,'[\"Existe capital inicial para validação.\", \"Contexto geográfico de atuação informado.\"]','[\"Definição de problema ainda superficial.\", \"Diferencial competitivo pouco claro.\", \"Público-alvo não segmentado.\", \"Questionário estratégico não preenchido.\"]','[\"Aprofundar a dor do cliente com entrevistas locais.\", \"Definir proposta de valor única frente aos concorrentes.\", \"Segmentar cliente ideal por perfil, renda e localização.\", \"Gerar e responder questionário dinâmico antes de escalar a ideia.\"]','A ideia precisa de ajustes estratégicos antes de avançar para execução.','2026-03-13 15:15:46','2026-03-13 15:15:46'),(4,8,13,'inviavel',25,'[\"Existe capital inicial para validação.\", \"Contexto geográfico de atuação informado.\"]','[\"Definição de problema ainda superficial.\", \"Diferencial competitivo pouco claro.\", \"Público-alvo não segmentado.\", \"Questionário estratégico não preenchido.\"]','[\"Aprofundar a dor do cliente com entrevistas locais.\", \"Definir proposta de valor única frente aos concorrentes.\", \"Segmentar cliente ideal por perfil, renda e localização.\", \"Gerar e responder questionário dinâmico antes de escalar a ideia.\"]','A ideia precisa de ajustes estratégicos antes de avançar para execução.','2026-03-14 20:06:08','2026-03-14 20:06:08'),(5,NULL,14,'viavel',100,'[\"Problema de negócio está bem definido.\", \"Diferencial competitivo identificado.\", \"Público-alvo mapeado.\", \"Existe capital inicial para validação.\", \"Contexto geográfico de atuação informado.\", \"Questionário estratégico preenchido de forma consistente.\"]','[]','[]','A ideia apresenta boa base de viabilidade para avançar para validação de mercado.','2026-03-14 20:46:05','2026-03-14 20:46:05'),(6,NULL,15,'viavel',100,'[\"Problema de negócio está bem definido.\", \"Diferencial competitivo identificado.\", \"Público-alvo mapeado.\", \"Existe capital inicial para validação.\", \"Contexto geográfico de atuação informado.\", \"Questionário estratégico preenchido de forma consistente.\"]','[]','[]','A ideia apresenta boa base de viabilidade para avançar para validação de mercado.','2026-03-14 20:48:19','2026-03-14 20:48:19'),(7,NULL,16,'viavel',100,'[\"Problema de negócio está bem definido.\", \"Diferencial competitivo identificado.\", \"Público-alvo mapeado.\", \"Existe capital inicial para validação.\", \"Contexto geográfico de atuação informado.\", \"Questionário estratégico preenchido de forma consistente.\"]','[]','[]','A ideia apresenta boa base de viabilidade para avançar para validação de mercado.','2026-03-14 20:50:11','2026-03-14 20:50:11'),(8,NULL,17,'viavel',100,'[\"Problema de negócio está bem definido.\", \"Diferencial competitivo identificado.\", \"Público-alvo mapeado.\", \"Existe capital inicial para validação.\", \"Contexto geográfico de atuação informado.\", \"Questionário estratégico preenchido de forma consistente.\"]','[]','[]','A ideia apresenta boa base de viabilidade para avançar para validação de mercado.','2026-03-14 20:58:25','2026-03-14 20:58:25'),(9,NULL,18,'viavel',100,'[\"Problema de negócio está bem definido.\", \"Diferencial competitivo identificado.\", \"Público-alvo mapeado.\", \"Existe capital inicial para validação.\", \"Contexto geográfico de atuação informado.\", \"Questionário estratégico preenchido de forma consistente.\"]','[]','[]','A ideia apresenta boa base de viabilidade para avançar para validação de mercado.','2026-03-14 21:08:29','2026-03-14 21:08:29'),(10,9,19,'inviavel',25,'[\"Existe capital inicial para validação.\", \"Contexto geográfico de atuação informado.\"]','[\"Definição de problema ainda superficial.\", \"Diferencial competitivo pouco claro.\", \"Público-alvo não segmentado.\", \"Questionário estratégico não preenchido.\"]','[\"Aprofundar a dor do cliente com entrevistas locais.\", \"Definir proposta de valor única frente aos concorrentes.\", \"Segmentar cliente ideal por perfil, renda e localização.\", \"Gerar e responder questionário dinâmico antes de escalar a ideia.\"]','A ideia precisa de ajustes estratégicos antes de avançar para execução.','2026-03-14 21:31:27','2026-03-14 21:31:27'),(11,10,20,'inviavel',40,'[\"Localização em Luanda, capital de Angola\", \"Setor de Pescas e Aquicultura com potencial de crescimento\"]','[\"Falta de clareza no problema e diferencial\", \"Público-alvo muito amplo\", \"Capital inicial pode ser insuficiente\"]','[\"Definir claramente o problema e o diferencial\", \"Especificar o público-alvo\", \"Aumentar o capital inicial\"]','Ideia com potencial, mas necessita de ajustes','2026-03-17 16:29:09','2026-03-17 16:29:09');
/*!40000 ALTER TABLE `viability_reports` ENABLE KEYS */;
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

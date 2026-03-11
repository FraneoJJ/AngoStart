CREATE DATABASE  IF NOT EXISTS `angostartbd` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `angostartbd`;
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
-- Table structure for table `empreendedor_profiles`
--

DROP TABLE IF EXISTS `empreendedor_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empreendedor_profiles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `phone` varchar(30) NOT NULL,
  `business_name` varchar(180) NOT NULL,
  `business_sector` varchar(120) NOT NULL,
  `business_stage` varchar(120) NOT NULL,
  `business_location` varchar(120) DEFAULT NULL,
  `accept_terms` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empreendedor_profiles`
--

LOCK TABLES `empreendedor_profiles` WRITE;
/*!40000 ALTER TABLE `empreendedor_profiles` DISABLE KEYS */;
INSERT INTO `empreendedor_profiles` VALUES (1,5,'923456789','Negocio Teste','comercio','ideia','luanda',1,'2026-03-05 14:38:49','2026-03-05 14:38:49'),(2,7,'923456789','Teste','comercio','ideia','luanda',1,'2026-03-05 21:22:41','2026-03-05 21:22:41'),(3,8,'921106010','AngoStart','tecnologia','inicio','luanda',1,'2026-03-05 21:34:16','2026-03-05 21:34:16'),(4,10,'923456789','Negocio X','comercio','ideia','luanda',1,'2026-03-09 12:50:01','2026-03-09 12:50:01'),(5,11,'923456789','Negocio X','comercio','ideia','luanda',1,'2026-03-09 12:57:13','2026-03-09 12:57:13');
/*!40000 ALTER TABLE `empreendedor_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ideas`
--

DROP TABLE IF EXISTS `ideas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ideas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(180) NOT NULL,
  `description` text NOT NULL,
  `sector` varchar(120) NOT NULL,
  `city` varchar(120) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `region` varchar(120) DEFAULT NULL,
  `latitude` decimal(10,7) NOT NULL,
  `longitude` decimal(10,7) NOT NULL,
  `initial_capital` decimal(14,2) NOT NULL DEFAULT '0.00',
  `problem` text,
  `differential_text` text,
  `target_audience` text,
  `status` enum('draft','submitted','analyzing','active','archived') NOT NULL DEFAULT 'submitted',
  `created_by` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_ideas_user` (`created_by`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ideas`
--

LOCK TABLES `ideas` WRITE;
/*!40000 ALTER TABLE `ideas` DISABLE KEYS */;
INSERT INTO `ideas` VALUES (1,'AgroLink Angola','Plataforma para conectar produtores locais a compradores urbanos com logística integrada.','AgriTech','Luanda','Viana, Luanda','Luanda',-8.8383000,13.2344000,850000.00,'Perda de produção por falta de canal de venda confiável.','Rede local de produtores com entrega assistida.','Pequenos produtores e mercados de bairro','archived',2,'2026-03-04 13:26:35','2026-03-10 21:48:06'),(2,'Kixicrédito PME','Solução de microcrédito digital para PMEs com análise de risco simplificada.','Fintech','Benguela','Centro de Benguela','Benguela',-12.5763000,13.4055000,1500000.00,'Dificuldade de acesso a crédito para PMEs.','Score híbrido com dados alternativos locais.','PMEs e comerciantes informais','active',2,'2026-03-04 13:26:35','2026-03-07 19:20:34'),(3,'EduMóvel Offline','Aplicativo de formação técnica com acesso offline para zonas com baixa internet.','Educação','Huambo','Cidade do Huambo','Huambo',-12.7761000,15.7390000,600000.00,'Baixo acesso a conteúdo técnico em regiões sem conectividade estável.','Conteúdo sincronizável e trilhas práticas curtas.','Jovens e profissionais em formação','active',2,'2026-03-04 13:26:35','2026-03-07 19:20:31'),(4,'Padaria','Padaria para fazer pão','Fintech','Luanda','Golf 2','Kilamba kiaxi',0.0000000,0.0000000,200000.00,'Acaba com a fome dosangolanos','A minha padaria também é pastelaria e vende muitas coisas','','submitted',8,'2026-03-09 13:13:11','2026-03-09 13:13:11');
/*!40000 ALTER TABLE `ideas` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `investidor_profiles`
--

LOCK TABLES `investidor_profiles` WRITE;
/*!40000 ALTER TABLE `investidor_profiles` DISABLE KEYS */;
INSERT INTO `investidor_profiles` VALUES (1,9,'955360283','008877445AR098','uige','individual','Professora','Salário ','500k-2m',NULL,NULL,NULL,'sim','Educação',NULL,'Relatorio de visitas Tel Net.pdf',NULL,1,1,'VER-I-MMGPAAML','rejected','2026-03-07 19:12:31','2026-03-07 19:16:25'),(2,11,'923456789','123456789LA042','luanda','individual','Empresario','Negocio','2m-10m',NULL,NULL,NULL,NULL,NULL,NULL,'bi.pdf',NULL,1,1,'VER-I-MMJ6RDQQ','pending','2026-03-09 12:57:14','2026-03-09 12:57:14');
/*!40000 ALTER TABLE `investidor_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `legal_checklist_progress`
--

DROP TABLE IF EXISTS `legal_checklist_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `legal_checklist_progress` (
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
  UNIQUE KEY `uq_legal_progress` (`user_id`,`idea_id`,`step_key`),
  KEY `fk_lcp_idea` (`idea_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `legal_checklist_progress`
--

LOCK TABLES `legal_checklist_progress` WRITE;
/*!40000 ALTER TABLE `legal_checklist_progress` DISABLE KEYS */;
INSERT INTO `legal_checklist_progress` VALUES (1,2,NULL,'empresa_nome',1,NULL,'2026-03-10 22:35:03','2026-03-10 22:35:03','2026-03-10 22:35:03'),(2,2,NULL,'empresa_nome',0,NULL,NULL,'2026-03-10 22:35:04','2026-03-10 22:35:04');
/*!40000 ALTER TABLE `legal_checklist_progress` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mentor_profiles`
--

LOCK TABLES `mentor_profiles` WRITE;
/*!40000 ALTER TABLE `mentor_profiles` DISABLE KEYS */;
INSERT INTO `mentor_profiles` VALUES (1,6,'923456781','123456789LA0','1990-01-01','luanda','gestao',5,'Empresa X','Gestor',NULL,'bi.pdf','cv.pdf',NULL,1,1,'VER-M-MMDKMMLG','approved','2026-03-05 14:38:49','2026-03-06 15:32:41');
/*!40000 ALTER TABLE `mentor_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questionnaire_answers`
--

DROP TABLE IF EXISTS `questionnaire_answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questionnaire_answers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `session_id` bigint unsigned NOT NULL,
  `question_key` varchar(120) NOT NULL,
  `answer_text` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_session_question` (`session_id`,`question_key`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questionnaire_answers`
--

LOCK TABLES `questionnaire_answers` WRITE;
/*!40000 ALTER TABLE `questionnaire_answers` DISABLE KEYS */;
/*!40000 ALTER TABLE `questionnaire_answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questionnaire_sessions`
--

DROP TABLE IF EXISTS `questionnaire_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questionnaire_sessions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `idea_id` bigint unsigned DEFAULT NULL,
  `context_json` json NOT NULL,
  `questions_json` json NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_qs_user` (`user_id`),
  KEY `fk_qs_idea` (`idea_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questionnaire_sessions`
--

LOCK TABLES `questionnaire_sessions` WRITE;
/*!40000 ALTER TABLE `questionnaire_sessions` DISABLE KEYS */;
INSERT INTO `questionnaire_sessions` VALUES (1,NULL,NULL,'{\"city\": \"\", \"region\": \"\", \"sector\": \"\", \"problem\": \"\", \"initialCapital\": 0, \"targetAudience\": \"\", \"differentialText\": \"\"}','[{\"key\": \"cliente_dor\", \"type\": \"textarea\", \"label\": \"Qual é a principal dor do cliente que sua ideia resolve?\", \"required\": true}, {\"key\": \"ticket_medio\", \"type\": \"number\", \"label\": \"Qual ticket médio estimado por cliente (Kz)?\", \"required\": true}, {\"key\": \"canal_aquisicao\", \"type\": \"select\", \"label\": \"Qual será o principal canal de aquisição de clientes?\", \"options\": [\"Redes Sociais\", \"Parcerias\", \"Indicação\", \"Tráfego Pago\", \"Outro\"], \"required\": true}, {\"key\": \"vantagem_competitiva\", \"type\": \"textarea\", \"label\": \"Qual vantagem competitiva sustentável da sua ideia?\", \"required\": true}, {\"key\": \"estrategia_bootstrap\", \"type\": \"textarea\", \"label\": \"Como você pretende validar MVP com baixo capital?\", \"required\": true}]','2026-03-04 10:16:40','2026-03-04 10:16:40');
/*!40000 ALTER TABLE `questionnaire_sessions` ENABLE KEYS */;
UNLOCK TABLES;

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

--
-- Table structure for table `user_subscriptions`
--

DROP TABLE IF EXISTS `user_subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_subscriptions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `plan_code` enum('free','pro','premium') NOT NULL DEFAULT 'free',
  `billing_cycle` enum('monthly','yearly') NOT NULL DEFAULT 'monthly',
  `status` enum('active','trialing','cancelled') NOT NULL DEFAULT 'active',
  `started_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_subscriptions`
--

LOCK TABLES `user_subscriptions` WRITE;
/*!40000 ALTER TABLE `user_subscriptions` DISABLE KEYS */;
INSERT INTO `user_subscriptions` VALUES (1,2,'premium','monthly','active','2026-03-04 14:04:03',NULL,'2026-03-04 14:04:03','2026-03-10 22:36:25'),(2,9,'pro','monthly','active','2026-03-07 19:13:59',NULL,'2026-03-07 19:13:59','2026-03-07 19:13:59'),(3,8,'pro','monthly','active','2026-03-09 13:08:02',NULL,'2026-03-09 13:08:02','2026-03-09 13:08:02');
/*!40000 ALTER TABLE `user_subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `email` varchar(190) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','empreendedor','mentor','investidor') NOT NULL DEFAULT 'empreendedor',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Pedro Silva','investidor@gmail.com','$2b$10$HO4soTjtbcu78nL9MBT4K.saf6KPplp2SBxf58xeQ43l6mRuIO/oy','investidor','2026-03-04 12:07:43','2026-03-04 12:07:43'),(2,'SPARCK','empreendedor@gmail.com','$2b$10$HO4soTjtbcu78nL9MBT4K.saf6KPplp2SBxf58xeQ43l6mRuIO/oy','empreendedor','2026-03-04 12:07:43','2026-03-04 12:07:43'),(3,'Ana Tavares','mentor@gmail.com','$2b$10$HO4soTjtbcu78nL9MBT4K.saf6KPplp2SBxf58xeQ43l6mRuIO/oy','mentor','2026-03-04 12:07:43','2026-03-04 12:07:43'),(4,'Nzamba Nkunku','admin@gmail.com','$2b$10$HO4soTjtbcu78nL9MBT4K.saf6KPplp2SBxf58xeQ43l6mRuIO/oy','admin','2026-03-04 12:07:43','2026-03-04 12:07:43'),(5,'Teste Emp 1772721529108','emp1772721529108@mail.com','$2b$10$ERKqJAHmV1Pr48sD5YRGn.hcyUbdqOmMpbty.3gW/tsBrrKXYVwv.','empreendedor','2026-03-05 14:38:49','2026-03-05 14:38:49'),(6,'Teste Men 1772721529108','men1772721529108@mail.com','$2b$10$80atDBCCK5Ts7RU5tafzhu3ZWZNJZWOdZWXJQB9lBKjnSKPU0ZPOe','mentor','2026-03-05 14:38:49','2026-03-05 14:38:49'),(7,'Teste Conexao 1772745761541','conexao1772745761541@mail.com','$2b$10$KVUipSeYRIPwkWPiCm1XcORxLp.8VmtvQgXPq1ovMSa14bfK3adWa','empreendedor','2026-03-05 21:22:41','2026-03-05 21:22:41'),(8,'Frâneo José João','franeojosejoao@gmail.com','$2b$10$KFDFBMU//Y9xqhVKTaivFehiskNBcUfuSy3chEFyKlk.j8M.ifKJy','empreendedor','2026-03-05 21:34:16','2026-03-05 21:34:16'),(9,'Testando','teste@gmail.com','$2b$10$dirx8o97Yn30SlvOXHTsU.nIADyPBPTOSPnvUBuKJNjMFM3PNVwi6','investidor','2026-03-07 19:12:31','2026-03-07 19:12:31'),(10,'Multi User','multi1773060601367@mail.com','$2b$10$R8K1Dn/Y6JWeOBs4G6N0uO4PDwToIEd9wp1lHnrEZDoGrN5Qx8l8e','empreendedor','2026-03-09 12:50:01','2026-03-09 12:50:01'),(11,'Multi User','multi1773061033105@mail.com','$2b$10$9AYhi1LUNgaLGgo1h7fQ6ONlwsUTCQfjFWLcvUiswslGZI85unEPq','empreendedor','2026-03-09 12:57:13','2026-03-09 12:57:13');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `viability_reports`
--

LOCK TABLES `viability_reports` WRITE;
/*!40000 ALTER TABLE `viability_reports` DISABLE KEYS */;
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

-- Dump completed on 2026-03-11 11:17:15

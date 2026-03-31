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
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ideas`
--

LOCK TABLES `ideas` WRITE;
/*!40000 ALTER TABLE `ideas` DISABLE KEYS */;
INSERT INTO `ideas` VALUES (1,'AgroLink Angola','Plataforma para conectar produtores locais a compradores urbanos com logística integrada.','AgriTech','Luanda','Viana, Luanda','Luanda',-8.8383000,13.2344000,850000.00,'Perda de produção por falta de canal de venda confiável.','Rede local de produtores com entrega assistida.','Pequenos produtores e mercados de bairro','active',2,'2026-03-04 13:26:35','2026-03-14 18:37:20'),(2,'Kixicrédito PME','Solução de microcrédito digital para PMEs com análise de risco simplificada.','Fintech','Benguela','Centro de Benguela','Benguela',-12.5763000,13.4055000,1500000.00,'Dificuldade de acesso a crédito para PMEs.','Score híbrido com dados alternativos locais.','PMEs e comerciantes informais','active',2,'2026-03-04 13:26:35','2026-03-07 19:20:34'),(3,'EduMóvel Offline','Aplicativo de formação técnica com acesso offline para zonas com baixa internet.','Educação','Huambo','Cidade do Huambo','Huambo',-12.7761000,15.7390000,600000.00,'Baixo acesso a conteúdo técnico em regiões sem conectividade estável.','Conteúdo sincronizável e trilhas práticas curtas.','Jovens e profissionais em formação','active',2,'2026-03-04 13:26:35','2026-03-07 19:20:31'),(4,'Padaria','Padaria para fazer pão','Fintech','Luanda','Golf 2','Kilamba kiaxi',0.0000000,0.0000000,200000.00,'Acaba com a fome dosangolanos','A minha padaria também é pastelaria e vende muitas coisas','','active',8,'2026-03-09 13:13:11','2026-03-13 13:57:29'),(5,'Salão de Festa','Festas para ajudar a descontrair, e esquecer dos problemas','Turismo e Hotelaria','Luanda','Largo do ambiente','Luanda',0.0000000,0.0000000,3000000.00,'O tédio das pessoas','O meu salão de festa não será tão car para ser alugado','','archived',8,'2026-03-13 13:59:33','2026-03-16 10:13:47'),(6,'teste','teste de apps','Saúde','Luanda','predio 34','Largo do ambiente',0.0000000,0.0000000,3000000.00,'Testa as apps','Testa as apps','Sass do mercado','active',8,'2026-03-13 15:09:38','2026-03-13 15:18:26'),(7,'Testa as apps','Testa as apps','Educação','Luanda','largo do ambinte','luanda',0.0000000,0.0000000,3000000.00,'Testa as apps','Testa as apps','Testa as apps','submitted',8,'2026-03-13 15:15:45','2026-03-13 15:15:45'),(8,'teste','teste de app','Petróleo e Gás','Luanda','Lago do ambiente','Luanda',0.0000000,0.0000000,20000.00,'teste de teste','teste de teste','Sass','submitted',2,'2026-03-14 20:06:07','2026-03-14 20:06:07'),(9,'Teste','Teteste de app no mercado','Indústria e Transformação','Luanda','Bairro 28 agosto','Luanda',0.0000000,0.0000000,2000000.00,'teste de teste','teste de teste','Jovens','submitted',8,'2026-03-14 21:31:26','2026-03-14 21:31:26'),(10,'teste','Tete dos iscos','Pescas e Aquicultura','Luanda','Porto','Luanda',0.0000000,0.0000000,200000.00,'Loremmmmmmmmmmmmmmmmmmmm','Loremmmmmmmmmmmmmmmmmmmm','Todos','submitted',2,'2026-03-17 16:29:06','2026-03-17 16:29:06');
/*!40000 ALTER TABLE `ideas` ENABLE KEYS */;
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

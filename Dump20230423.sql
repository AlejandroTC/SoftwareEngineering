-- MySQL dump 10.13  Distrib 8.0.29, for Linux (x86_64)
--
-- Host: localhost    Database: recetasDB
-- ------------------------------------------------------
-- Server version	8.0.32-0ubuntu0.22.04.2

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
-- Table structure for table `grupo`
--

DROP TABLE IF EXISTS `grupo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grupo` (
  `idgrupo` int NOT NULL,
  `clave` varchar(45) NOT NULL,
  `nombre` varchar(45) NOT NULL,
  PRIMARY KEY (`idgrupo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grupo`
--

LOCK TABLES `grupo` WRITE;
/*!40000 ALTER TABLE `grupo` DISABLE KEYS */;
/*!40000 ALTER TABLE `grupo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grupo_has_planeacion`
--

DROP TABLE IF EXISTS `grupo_has_planeacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grupo_has_planeacion` (
  `id_grupo` int NOT NULL,
  `id_planeacion` int NOT NULL,
  KEY `IDgrupo_idx` (`id_grupo`),
  KEY `IDplaneacion_idx` (`id_planeacion`),
  CONSTRAINT `grupoID` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`idgrupo`),
  CONSTRAINT `planeacionID` FOREIGN KEY (`id_planeacion`) REFERENCES `planeacion` (`idplaneacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grupo_has_planeacion`
--

LOCK TABLES `grupo_has_planeacion` WRITE;
/*!40000 ALTER TABLE `grupo_has_planeacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `grupo_has_planeacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingredientes`
--

DROP TABLE IF EXISTS `ingredientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingredientes` (
  `idIngredientes` int NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `unidadmedida` varchar(45) NOT NULL,
  PRIMARY KEY (`idIngredientes`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredientes`
--

LOCK TABLES `ingredientes` WRITE;
/*!40000 ALTER TABLE `ingredientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `ingredientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pasos`
--

DROP TABLE IF EXISTS `pasos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pasos` (
  `idPasos` int NOT NULL AUTO_INCREMENT,
  `nopaso` varchar(45) NOT NULL,
  `paso` text NOT NULL,
  `imagen` varchar(45) DEFAULT NULL,
  `Recetas_idRecetas` int NOT NULL,
  PRIMARY KEY (`idPasos`),
  KEY `fk_Pasos_Recetas1_idx` (`Recetas_idRecetas`),
  CONSTRAINT `fk_Pasos_Recetas1` FOREIGN KEY (`Recetas_idRecetas`) REFERENCES `recetas` (`idRecetas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pasos`
--

LOCK TABLES `pasos` WRITE;
/*!40000 ALTER TABLE `pasos` DISABLE KEYS */;
/*!40000 ALTER TABLE `pasos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `planeacion`
--

DROP TABLE IF EXISTS `planeacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `planeacion` (
  `idplaneacion` int NOT NULL,
  PRIMARY KEY (`idplaneacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planeacion`
--

LOCK TABLES `planeacion` WRITE;
/*!40000 ALTER TABLE `planeacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `planeacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `planeacion_has_recetas`
--

DROP TABLE IF EXISTS `planeacion_has_recetas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `planeacion_has_recetas` (
  `id_planeacion` int NOT NULL,
  `id_recetas` int NOT NULL,
  KEY `planeacionID_idx` (`id_planeacion`),
  KEY `recetasID_idx` (`id_recetas`),
  CONSTRAINT `planeacion_id` FOREIGN KEY (`id_planeacion`) REFERENCES `planeacion` (`idplaneacion`),
  CONSTRAINT `recetas_id` FOREIGN KEY (`id_recetas`) REFERENCES `recetas` (`idRecetas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planeacion_has_recetas`
--

LOCK TABLES `planeacion_has_recetas` WRITE;
/*!40000 ALTER TABLE `planeacion_has_recetas` DISABLE KEYS */;
/*!40000 ALTER TABLE `planeacion_has_recetas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recetas`
--

DROP TABLE IF EXISTS `recetas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recetas` (
  `idRecetas` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `duracion` varchar(45) NOT NULL,
  `tiempo_comida` varchar(45) NOT NULL,
  `tiempo_receta` varchar(45) NOT NULL,
  `porciones` varchar(45) NOT NULL,
  `imagen` varchar(45) DEFAULT NULL,
  `Usuarios_correo` varchar(255) NOT NULL,
  `caificacion` int DEFAULT NULL,
  PRIMARY KEY (`idRecetas`,`Usuarios_correo`),
  KEY `fk_Recetas_Usuarios1_idx` (`Usuarios_correo`),
  CONSTRAINT `fk_Recetas_Usuarios1` FOREIGN KEY (`Usuarios_correo`) REFERENCES `usuarios` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recetas`
--

LOCK TABLES `recetas` WRITE;
/*!40000 ALTER TABLE `recetas` DISABLE KEYS */;
/*!40000 ALTER TABLE `recetas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recetas_has_ingredientes`
--

DROP TABLE IF EXISTS `recetas_has_ingredientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recetas_has_ingredientes` (
  `Recetas_idRecetas` int NOT NULL,
  `Ingredientes_idIngredientes` int NOT NULL,
  `cantidad` float NOT NULL,
  `unidad_medida` varchar(45) NOT NULL,
  PRIMARY KEY (`Recetas_idRecetas`,`Ingredientes_idIngredientes`),
  KEY `fk_Recetas_has_Ingredientes_Ingredientes1_idx` (`Ingredientes_idIngredientes`),
  KEY `fk_Recetas_has_Ingredientes_Recetas1_idx` (`Recetas_idRecetas`),
  CONSTRAINT `fk_Recetas_has_Ingredientes_Ingredientes1` FOREIGN KEY (`Ingredientes_idIngredientes`) REFERENCES `ingredientes` (`idIngredientes`),
  CONSTRAINT `fk_Recetas_has_Ingredientes_Recetas1` FOREIGN KEY (`Recetas_idRecetas`) REFERENCES `recetas` (`idRecetas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recetas_has_ingredientes`
--

LOCK TABLES `recetas_has_ingredientes` WRITE;
/*!40000 ALTER TABLE `recetas_has_ingredientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `recetas_has_ingredientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_has_grupo`
--

DROP TABLE IF EXISTS `usuario_has_grupo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_has_grupo` (
  `idgrupo` int NOT NULL,
  `correo` varchar(45) NOT NULL,
  `rol` varchar(45) NOT NULL,
  PRIMARY KEY (`idgrupo`),
  KEY `correo_idx` (`correo`),
  CONSTRAINT `correo` FOREIGN KEY (`correo`) REFERENCES `usuarios` (`correo`),
  CONSTRAINT `idgrupo` FOREIGN KEY (`idgrupo`) REFERENCES `grupo` (`idgrupo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_has_grupo`
--

LOCK TABLES `usuario_has_grupo` WRITE;
/*!40000 ALTER TABLE `usuario_has_grupo` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario_has_grupo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_has_ingredientes`
--

DROP TABLE IF EXISTS `usuario_has_ingredientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_has_ingredientes` (
  `usuario_correo` varchar(45) NOT NULL,
  `ingrediente_id` int NOT NULL,
  KEY `correo_idx` (`usuario_correo`),
  KEY `fk_usuario_has_ingredientes_1_idx` (`ingrediente_id`),
  CONSTRAINT `ingredientesID` FOREIGN KEY (`ingrediente_id`) REFERENCES `ingredientes` (`idIngredientes`),
  CONSTRAINT `usuariocorreo` FOREIGN KEY (`usuario_correo`) REFERENCES `usuarios` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_has_ingredientes`
--

LOCK TABLES `usuario_has_ingredientes` WRITE;
/*!40000 ALTER TABLE `usuario_has_ingredientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario_has_ingredientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_has_planeacion`
--

DROP TABLE IF EXISTS `usuario_has_planeacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_has_planeacion` (
  `correo_usuario` varchar(45) NOT NULL,
  `id_planeacion` int NOT NULL,
  KEY `correo_usuario_idx` (`correo_usuario`),
  KEY `id_planeacion_idx` (`id_planeacion`),
  CONSTRAINT `correo_usuario` FOREIGN KEY (`correo_usuario`) REFERENCES `usuarios` (`correo`),
  CONSTRAINT `id_planeacion` FOREIGN KEY (`id_planeacion`) REFERENCES `planeacion` (`idplaneacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_has_planeacion`
--

LOCK TABLES `usuario_has_planeacion` WRITE;
/*!40000 ALTER TABLE `usuario_has_planeacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario_has_planeacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `correo` varchar(255) NOT NULL,
  `clave` varchar(45) NOT NULL,
  `nombre` varchar(45) NOT NULL,
  PRIMARY KEY (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-04-23 13:30:49

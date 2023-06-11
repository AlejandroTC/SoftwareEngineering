<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "recetasDB";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // Establecer el modo de error PDO a excepción
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  
    // Consulta SQL para recuperar los datos
    $sql = "SELECT nombre FROM ingredientes";
    $stmt = $conn->prepare($sql);
    $stmt->execute();

  
    // Recuperar los resultados y convertirlos en un objeto JSON
    $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $json = json_encode($resultados);
  
    // Enviar la respuesta como JSON
    header('Content-Type: application/json');
   
    echo $json;
    
  } catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
  }
?>
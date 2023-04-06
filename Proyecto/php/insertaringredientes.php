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
if (empty($resultados)) {
  // Si $resultados está vacío, enviamos una respuesta vacía
  http_response_code(204); // Código HTTP 204 significa "No Content"
} else {
  // Si $resultados no está vacío, lo convertimos a JSON
  $json = json_encode($resultados);
  
  // Enviar la respuesta como JSON
  header('Content-Type: application/json');
  echo $json;
}

?>
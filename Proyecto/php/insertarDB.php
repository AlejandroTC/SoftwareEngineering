<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "recetasDB";
try {
	$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
	// Establecer el modo de error PDO a excepción
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	// Obtener la sentencia SQL enviada por el cliente
	$sql = $_POST['sql'];

	// Ejecutar la sentencia SQL en la base de datos
	$resultado = $conn->query($sql);

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
} catch(PDOException $e) {
	echo "Error: " . $e->getMessage();
}
?>

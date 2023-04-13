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

	// Obtener los datos del resultado y convertirlos a un array asociativo
	$datos = $resultado->fetchAll(PDO::FETCH_ASSOC);
	
	//file_put_contents('respuesta.json', $datos);
	// Enviar respuesta al cliente en formato JSON
	header('Content-Type: application/json');
	echo json_encode($datos);

	// Cerrar conexión a la base de datos
	$conn = null;
} catch(PDOException $e) {
	echo "Error: " . $e->getMessage();
}
?>

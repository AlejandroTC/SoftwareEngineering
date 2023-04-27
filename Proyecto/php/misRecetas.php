<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "recetasDB";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
	// Establecer el modo de error PDO a excepción
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    header("Content-Type: application/json");
    $sql = $_POST['sql'];
    $resultado = $conn->query($sql);

    // Usar la función de PDO para obtener la imagen
    $row = $resultado->fetch(PDO::FETCH_ASSOC);
    $imagen = $row["imagen"];

    if ($imagen) {
        $imagen_base64 = base64_encode($imagen);
        echo json_encode($imagen_base64);  
    } else {
        // Manejar el caso en el que no se encuentra ninguna imagen
        throw new Exception("No se encontró ninguna imagen");
    }
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
} catch(Exception $e) {
    echo json_encode(array("error" => $e->getMessage()));
}
?>

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
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    // Obtener los datos del resultado y convertirlos a un array asociativo
    $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Recorrer los resultados y obtener la imagen en formato base64
    foreach ($resultados as &$resultado) {
        $imagen = $resultado['imagen'];
        $resultado['imagen'] = base64_encode($imagen);
    }
    
    // Enviar respuesta al cliente en formato JSON
    header('Content-Type: application/json');
    echo json_encode($resultados);

    // Cerrar conexión a la base de datos
    $conn = null;
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>

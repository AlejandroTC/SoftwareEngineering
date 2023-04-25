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
    if ($resultado && mysqli_num_rows($resultado) > 0) {
        $fila = mysqli_fetch_assoc($resultado);
        $imagen = $fila["imagen"];
        $tipo = $imagen->type;
        $datos = base64_encode(file_get_contents($imagen->tmp_name));
        $url = "data:$tipo;base64,$datos";
        echo json_encode(array("url" => $url)); 
    } else {
        echo json_encode(array("error" => "No se encontró ninguna imagen"));
    }
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>

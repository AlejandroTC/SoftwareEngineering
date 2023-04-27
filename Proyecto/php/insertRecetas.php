<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "recetasDB";
try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // Establecer el modo de error PDO a excepción
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Obtener los valores del formulario
    $rName = $_POST['nombre'];
    $rDuration = $_POST['duracion'];
    $rTime = $_POST['tiempo_comida'];
    $rType = $_POST['tiempo_receta'];
    $rPortion = $_POST['porciones'];
    $rimg = $_FILES['imagen']['tmp_name'];
    $correo = $_POST['usuarios_correo'];
    // Preparar la consulta SQL
    $stmt = $conn->prepare('INSERT INTO recetas (nombre, duracion, tiempo_comida, tiempo_receta, porciones, imagen, usuarios_correo) VALUES (:nombre, :duracion, :tiempo_comida, :tiempo_receta, :porciones, :imagen, :usuarios_correo)');

    // Asignar los valores del formulario a los marcadores de posición
    $stmt->bindValue(':nombre', $rName);
    $stmt->bindValue(':duracion', $rDuration);
    $stmt->bindValue(':tiempo_comida', $rTime);
    $stmt->bindValue(':tiempo_receta', $rType);
    $stmt->bindValue(':porciones', $rPortion);
    $stmt->bindValue(':imagen', file_get_contents($rimg));
    $stmt->bindValue(':usuarios_correo', $correo);

    // Ejecutar la consulta
    $stmt->execute();

    // Comprobar si la consulta se ejecutó correctamente
    if ($stmt->rowCount() > 0) {
        echo 'La receta se ha insertado correctamente.';
    } else {
        echo 'Ha ocurrido un error al insertar la receta.';
    }

    // Cerrar la conexión a la base de datos
    $conn = null;
} catch(PDOException $e) {
	echo "Error: " . $e->getMessage();
}
?>

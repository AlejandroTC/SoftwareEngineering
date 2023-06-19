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
    $id = $_POST['id'];
    $gimg = $_FILES['imagen']['tmp_name'];

    // Preparar la consulta SQL para actualizar la imagen del grupo
    $stmt = $conn->prepare('UPDATE grupo SET imagen = :imagen WHERE idgrupo = :id');
    
    // Asignar los valores del formulario a los marcadores de posición
    $stmt->bindValue(':imagen', file_get_contents($gimg));
    $stmt->bindValue(':id', $id);
    
    // Ejecutar la consulta
    $stmt->execute();
    
    // Comprobar si la consulta se ejecutó correctamente
    if ($stmt->rowCount() > 0) {
        echo 'La imagen del grupo se ha actualizado';
    } else {
        echo 'No se ha actualizado la imagen del grupo';
    }
    
    // Cerrar la conexión a la base de datos
    $conn = null;
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>

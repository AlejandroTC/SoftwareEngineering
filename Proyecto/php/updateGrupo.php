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
    $name = $_POST['nombre'];
    $code = $_POST['clave'];
    $description = $_POST['descripcion'];
    $correo = $_POST['correo'];
    
    // Preparar la consulta SQL para actualizar los datos del grupo
    $stmt = $conn->prepare('UPDATE grupo SET nombre = :nombre, clave = :clave, descripcion = :descripcion WHERE idgrupo = :id');
    
    // Asignar los valores del formulario a los marcadores de posición
    $stmt->bindValue(':nombre', $name);
    $stmt->bindValue(':clave', $code);
    $stmt->bindValue(':descripcion', $description);
    $stmt->bindValue(':id', $id);
    
    // Ejecutar la consulta
    $stmt->execute();
    
    // Comprobar si la consulta se ejecutó correctamente
    if ($stmt->rowCount() > 0) {
        echo 'El grupo se ha actualizado';
        
    } else {
        echo 'No se ha actualizado el grupo';
    }
    
    // Cerrar la conexión a la base de datos
    $conn = null;
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>

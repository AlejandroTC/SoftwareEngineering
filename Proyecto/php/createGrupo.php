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
    $name = $_POST['nombre'];
    $code = $_POST['clave'];
    $description = $_POST['descripcion'];
    $rimg = $_FILES['imagen']['tmp_name'];
    
    // Consulta para agregar la planeación asociada al grupo a crear
    $queryMain = "INSERT INTO planeacion(idplaneacion) VALUES (NULL)";
    $conn->exec($queryMain);
    
    // Obtener el último valor de id
    $maxId = $conn->lastInsertId();
    
    // Preparar la consulta SQL para insertar los datos del grupo
    $stmt = $conn->prepare('INSERT INTO grupo (nombre, clave, descripcion, imagen, planeacion_idplaneacion) VALUES (:nombre, :clave, :descripcion, :imagen, :planeacion_idplaneacion)');
    
    // Asignar los valores del formulario a los marcadores de posición
    $stmt->bindValue(':nombre', $name);
    $stmt->bindValue(':clave', $code);
    $stmt->bindValue(':descripcion', $description);
    $stmt->bindValue(':imagen', file_get_contents($rimg));
    $stmt->bindValue(':planeacion_idplaneacion', $maxId);
    
    // Ejecutar la consulta
    $stmt->execute();
    
    // Comprobar si la consulta se ejecutó correctamente
    if ($stmt->rowCount() > 0) {
        echo 'El grupo se ha creado';
    } else {
        echo 'No se ha creado el grupo';
    }
    
    // Cerrar la conexión a la base de datos
    $conn = null;
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>

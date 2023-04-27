<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "recetasDB";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $nopaso = $_POST['nopaso'];
    $paso = $_POST['paso'];
    $imagen = $_FILES['imagen']['tmp_name'];
    $Recetas_idRecetas = $_POST['Recetas_idRecetas'];

    $stmt = $conn->prepare('INSERT INTO pasos (numero_paso, descripcion, imagen, Recetas_idRecetas) VALUES (:nopaso, :paso, :imagen, :receta)');

    $stmt->bindValue(':nopaso', $nopaso);
    $stmt->bindValue(':paso', $paso);
    $stmt->bindValue(':imagen', file_get_contents($imagen));
    $stmt->bindValue(':receta', $Recetas_idRecetas);

    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo 'El paso con imagen se ha insertado correctamente.';
    } else {
        echo 'Ha ocurrido un error al insertar el paso con imagen.';
    }

    $conn = null;
} catch(PDOException $e) {
	echo "Error: " . $e->getMessage();
}
?>
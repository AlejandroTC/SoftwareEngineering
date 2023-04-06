<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "recetasDB";

// Conexión a la base de datos
$conn = mysqli_connect($servername, $username, $password, $dbname);


// Recibir los nuevos valores del formulario
$nombre_nuevo = $_POST['nombre'];
$duracion_nuevo = $_POST['duracion'];
$porciones_nuevo = $_POST['porciones'];
$tiempocomida_nuevo = $_POST['tiempo_comida'];
$tipocomida_nuevo = $_POST['tipo_comida'];




// Actualizar la base de datos con los nuevos valores
mysqli_query($conn, "UPDATE recetas SET nombre='$nombre_nuevo' WHERE idRecetas=1");
mysqli_query($conn, "UPDATE recetas SET duracion='$duracion_nuevo' WHERE idRecetas=1");
mysqli_query($conn, "UPDATE recetas SET porciones='$porciones_nuevo' WHERE idRecetas=1");
mysqli_query($conn, "UPDATE recetas SET tiempo_comida='$tiempocomida_nuevo' WHERE idRecetas=1");
mysqli_query($conn, "UPDATE recetas SET tiempo_receta='$tipocomida_nuevo' WHERE idRecetas=1");


echo "Los datos han sido actualizados correctamente";

// Cerrar la conexión a la base de datos
mysqli_close($conn);
?>







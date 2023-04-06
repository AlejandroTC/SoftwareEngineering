<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "recetasDB";

// Conexión a la base de datos
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Verificar si se ha eliminado el registro
$eliminareceta = mysqli_query($conn, "DELETE FROM recetas WHERE idRecetas = 3");

if(mysqli_affected_rows($conn) > 0) {
    echo '<script language="javascript">alert("El registro ha sido eliminado exitosamente.");</script>';
    header("Location: /ComidayCompras/Proyecto/html/readReceta.php");
} else {
    echo '<script language="javascript">alert("El registro no existe en la base de datos.");</script>';
    header("Location: /ComidayCompras/Proyecto/html/readReceta.php");
}

mysqli_close($conn);
?>

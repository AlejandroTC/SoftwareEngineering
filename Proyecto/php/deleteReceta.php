<?php
include('connect.php');
session_start();

$correo = isset($_SESSION['correo']) ? $_SESSION['correo'] : null;
$idReceta = isset($_POST['idReceta']) ? $_POST['idReceta'] : null;

$consultaP = "SELECT idplaneacion AS id FROM planeacion p JOIN usuarios u on (p.idplaneacion=u.planeacion_idplaneacion) WHERE correo = '$correo';";
$result = mysqli_query($conex, $consultaP);
$row = mysqli_fetch_assoc($result);
$id = $row['id'];

// Verificar si se ha eliminado el registro
$eliminarPlaneacion = mysqli_query($conex, "DELETE FROM recetas_has_planeacion WHERE recetas_idRecetas = $idReceta AND recetas_Usuarios_correo = '$correo' AND planeacion_idplaneacion = $id");
if($eliminarPlaneacion)
{
    echo "
    <script>
        window.location = '../html/planeacion.html';
    </script>
    ";

}

mysqli_close($conex);
?>

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

    mysqli_close($conex);

    if ($eliminarPlaneacion) {
        $response = array(
            'success' => true,
            'message' => 'Registro eliminado exitosamente'
        );
    } else {
        $response = array(
            'success' => false,
            'message' => 'Error al eliminar el registro'
        );
    }

    // Devolver la respuesta como JSON
    header('Content-Type: application/json');
    echo json_encode($response);
?>

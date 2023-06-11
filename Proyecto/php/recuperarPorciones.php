<?php
    include('connect.php');
    session_start();

    $correo = isset($_SESSION['correo']) ? $_SESSION['correo'] : null;

    // Recibir los datos de la consulta desde JavaScript
    $no_porciones = isset($_POST['no_porciones']) ? $_POST['no_porciones'] : null;
    $idReceta = isset($_POST['idReceta']) ? $_POST['idReceta'] : null;

    $consultaP = "SELECT idplaneacion AS id FROM planeacion p JOIN usuarios u on (p.idplaneacion=u.planeacion_idplaneacion) WHERE correo = '$correo';";
    $result = mysqli_query($conex, $consultaP);
    $row = mysqli_fetch_assoc($result);
    $id = $row['id'];

    //Generar una consulta que permita verificar si la receta ya ha sido incluida en la planeación.
    $consultaDub = "SELECT * FROM recetas_has_planeacion WHERE recetas_idRecetas = $idReceta AND recetas_Usuarios_correo = '$correo' AND planeacion_idplaneacion = $id;";
    $resultDub = mysqli_query($conex, $consultaDub);

    // Verificar si la receta ya ha sido agregada anteriormente
    if (mysqli_num_rows($resultDub) > 0) {
        $response = array(
            'success' => false,
            'message' => 'La receta ya ha sido agregada anteriormente a la planeación.'
        );
        // Devolver la respuesta como JSON
        header('Content-Type: application/json');
        echo json_encode($response);
        exit;
    }

    // Realizar la consulta a la base de datos utilizando los datos recibidos
    if ($no_porciones > 0) {
        $query = "INSERT INTO recetas_has_planeacion (recetas_idRecetas, recetas_Usuarios_correo, planeacion_idplaneacion, no_porciones) VALUES ('$idReceta', '$correo', '$id', '$no_porciones');";
        mysqli_query($conex, $query);

        $response = array(
            'success' => true,
            'message' => 'Receta agregada exitosamente.'
        );
        // Devolver la respuesta como JSON
        header('Content-Type: application/json');
        echo json_encode($response);
    } else {
        $response = array(
            'success' => false,
            'message' => 'Número de porciones incorrecto.'
        );
        // Devolver la respuesta como JSON
        header('Content-Type: application/json');
        echo json_encode($response);
    }

    mysqli_close($conex);
?>


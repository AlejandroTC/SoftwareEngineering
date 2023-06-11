<?php
    // Consulta que recupera el último valor de id
    session_start();
    include('connect.php');
    $correo = isset($_SESSION['correo']) ? $_SESSION['correo'] : null;
    
    $consultaP = "SELECT planeacion_idPlaneacion FROM usuarios WHERE correo = '$correo'";
    $result = mysqli_query($conex, $consultaP);
    $row = mysqli_fetch_assoc($result);
    $idPlaneacion = $row['planeacion_idPlaneacion'];
    
    echo json_encode(array('idPlaneacion' => $idPlaneacion));
    
?>

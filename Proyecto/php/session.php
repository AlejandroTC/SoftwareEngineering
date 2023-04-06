<?php
    session_start();
    $correo = $_SESSION['correo'];
    echo json_encode(array('correo' => $correo));
?>

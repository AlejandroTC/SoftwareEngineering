<?php
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "recetasDB";

    // Obtener el ID de la receta enviado por POST
    $idReceta = $_POST['idReceta'];
    
    // Crear la conexión
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Verificar la conexión
    if ($conn->connect_error) {
        die("Error en la conexión: " . $conn->connect_error);
    }
    echo $conn;
    // Consulta SQL para obtener los detalles de la receta
    $sql = "SELECT * FROM recetas WHERE idRecetas = $idReceta";
    $result = $conn->query($sql);

    // Verificar si se encontró la receta
    if ($result->num_rows > 0) {
        $result->fetch_assoc();

        // Enviar los detalles de la receta como respuesta JSON
        echo json_encode($result);
    } else {
        echo json_encode(null); // Si no se encontró la receta, enviar null como respuesta JSON
    }

    $conn->close(); // Cerrar la conexión
?>

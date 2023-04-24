<?php
/*
El siguiente código está escrito en PHP y recupera datos de una tabla de base de datos MySQL llamada "ingredientes" y los devuelve en formato JSON. Aquí hay una explicación de lo que hace el código:
    Las variables $servername, $username, $password y $dbname se inicializan con los valores necesarios para conectarse a la base de datos MySQL.
    Se utiliza un bloque try-catch para capturar cualquier excepción que pueda ocurrir al conectarse a la base de datos.
    La clase PDO (PHP Data Objects) se utiliza para crear una conexión a la base de datos utilizando las credenciales proporcionadas.
    Se llama al método PDO::setAttribute para establecer el modo de error de PDO en PDO::ERRMODE_EXCEPTION, lo que significa que PDO lanzará una excepción si se produce un error en lugar de devolver false.
    Se define una consulta SQL para recuperar todos los datos de la tabla "ingredientes".
    Se crea un objeto PDOStatement llamando al método prepare en el objeto PDO y pasando la consulta SQL como parámetro.
    Se llama al método execute en el objeto PDOStatement para ejecutar la consulta SQL.
    Se llama al método fetchAll en el objeto PDOStatement para recuperar todos los resultados como un array de arrays asociativos.
    Se llama a la función json_encode en el array de resultados para convertirlo al formato JSON.
    Se establece la cabecera Content-Type en "application/json" utilizando la función header.
    Se imprime el array codificado en JSON como respuesta.
ATC
*/
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "recetasDB";
try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // Establecer el modo de error PDO a excepción
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Consulta SQL para recuperar los datos
    $sql = "SELECT * FROM ingredientes";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    // Recuperar los resultados y convertirlos en un objeto JSON
    $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $json = json_encode($resultados);
    // Enviar la respuesta como JSON
    header('Content-Type: application/json');
    echo $json;
  } catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
  }
?>
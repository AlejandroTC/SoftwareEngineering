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

The following code is written in PHP and retrieves data from a MySQL database table named "ingredientes" and returns it in JSON format. Here's a breakdown of what the code does:
    The variables $servername, $username, $password, and $dbname are initialized with the values required to connect to the MySQL database.
    A try-catch block is used to catch any exceptions that may occur while connecting to the database.
    The PDO (PHP Data Objects) class is used to create a connection to the database using the given credentials.
    The PDO::setAttribute method is called to set the error mode of PDO to PDO::ERRMODE_EXCEPTION, which means that PDO will throw an exception if an error occurs instead of returning false.
    A SQL query is defined to retrieve all the data from the "ingredientes" table.
    A PDOStatement object is created by calling the prepare method on the PDO object and passing the SQL query as a parameter.
    The execute method is called on the PDOStatement object to execute the SQL query.
    The fetchAll method is called on the PDOStatement object to fetch all the results as an array of associative arrays.
    The json_encode function is called on the array of results to convert it to JSON format.
    The Content-Type header is set to "application/json" using the header function.
    The JSON-encoded array is echoed as the response.
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
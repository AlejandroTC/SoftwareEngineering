<?php
include('connect.php');

$usuario=$_POST['usuario'];
$correo=$_POST['correo'];
$contrasena=$_POST['clave'];

$consulta = "SELECT * FROM usuarios WHERE correo = '$correo'";
$resultado = mysqli_query($conex,$consulta);
$rconsulta = mysqli_num_rows($resultado);

if($rconsulta)
{
    echo "
    <script>
        alert('El correo ya se encuentra asociado a un usuario');
        window.location = '../html/registrarusuarios.html';
    </script>
    ";
}
else
{
    // Consulta para agrgar la planeación asociada al usuario a crear
    $queryMain = "INSERT INTO planeacion(idplaneacion) VALUES (NULL)";
    mysqli_query($conex,$queryMain);

    // Consulta que recupera el último valor de id
    $consultaP = "SELECT MAX(idplaneacion) AS max_id FROM planeacion";
    $result = mysqli_query($conex, $consultaP);
    $row = mysqli_fetch_assoc($result);
    $maxId = $row['max_id'];
    
    $query = "INSERT INTO usuarios (correo, clave, nombre, planeacion_idplaneacion) VALUES ('$correo', '$contrasena', '$usuario', '$maxId')";
    $resultado = mysqli_query($conex,$query);

    if($resultado)
{
    echo "
    <script>
        alert('Usuario registrado exitosamente');
        window.location = '../html/index.html';
    </script>
    ";

}
}

?>
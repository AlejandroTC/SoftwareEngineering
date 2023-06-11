<?php
    
    //Conexión a la base de datos
    include 'connect.php';
    $Respuesta = array();

    $data = json_decode(file_get_contents('php://input'), true);
    $accion = isset($data['accion']) ? $data['accion'] : '';

    switch ($accion) {
        case 'create':
            actionCreatePHP($conex);
            break;
        case 'update':
            actionUpdatePHP($conex);
            break;
        case 'delete':
            actionDeletePHP($conex);
            break;
        case 'read':
            actionRead($conex);
            break;
        case 'read_id':
            actionReadByIdPHP($conex);
            break;
        default:
            # code...
            break;
    }

    function actionCreatePHP($conex)
    {
        //Recuperación de los datos
        $data = json_decode(file_get_contents('php://input'), true);    //Parte para decodificar lo que recibimos del js

        $ingrediente = $data['nombre'];
        $cantidad = $data['cantidad'];  
        $unidad_medida = $data['unidad_medida'];

        $email = isset($data['email']) ? $data['email'] : '';
        //Consulta del id en la base de datos
        $consultaid =  "SELECT idIngredientes FROM ingredientes WHERE nombre = '$ingrediente'";
        $resultadoid = mysqli_query($conex,$consultaid);
        if(mysqli_num_rows($resultadoid)==1)
        {
            $id = mysqli_fetch_assoc($resultadoid)['idIngredientes']; 
            //echo json_encode(['id' => $id]);       //->Parte para poder ver el id que estamos recogiendo
    
            //Consulta de la inserción a la base de datos
            $consultainsert = "INSERT INTO `usuario_has_ingredientes`(`usuario_correo`, `ingrediente_id`, `cantidad`, `unidad_medida`) VALUES ('$email','$id','$cantidad','$unidad_medida')";
            $resultadoinsert = mysqli_query($conex,$consultainsert);
                
            if($resultadoinsert)
            {
                echo json_encode(['Respuesta' => 1]);
            }
        }
        else
        {
            echo json_encode(['Respuesta' => 0]);
        }
    }
?>
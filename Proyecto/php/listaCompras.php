<?php
    //Conexión a la base de datos
    include 'connect.php';
    $Respuesta = array();
    $accion = $_POST['accion'];

    switch ($accion) {
        case 'read':
            actionReadPHP($conex);
            break;
        default:
            # code...
            break;
    }

    function actionReadPHP($conex) {
        // Consultar por el correo el id_planeacion
        if (isset($_POST['correo'])) {
            $correo = $_POST['correo'];
            
            // Realiza consulta para sacar la lista de ingredientes que se necesitan para hacer todas lasrecetas con las porciones planeadas
            // Ya saca de cada ingrediente cuanto ocupa y lo pone por unidad de medida, ya suma.
            $QueryIngredientesPedidos = "SELECT rhi.Ingredientes_idIngredientes AS idIngredientePedido, 
                                        CASE WHEN COUNT(*) > 1 THEN SUM(((rhi.cantidad / r.porciones ) * rhp.no_porciones)) 
                                        ELSE ((rhi.cantidad / r.porciones ) * rhp.no_porciones) END AS cantidadPedida, 
                                        rhi.unidad_medida AS unidadMedidaPedida, i.nombre AS nombreIngredientePedido
                                        FROM recetas_has_ingredientes AS rhi
                                        JOIN ingredientes AS i ON rhi.Ingredientes_idIngredientes = i.idIngredientes
                                        JOIN recetas_has_planeacion AS rhp ON rhi.Recetas_idRecetas = rhp.recetas_idRecetas
                                        JOIN recetas AS r ON rhi.Recetas_idRecetas = r.idRecetas
                                        WHERE rhi.Recetas_idRecetas IN (
                                            SELECT r.idRecetas
                                            FROM recetas AS r
                                            JOIN recetas_has_planeacion AS rhp ON r.idRecetas = rhp.recetas_idRecetas
                                            WHERE rhp.planeacion_idplaneacion = (
                                                SELECT u.planeacion_idplaneacion
                                                FROM usuarios AS u
                                                WHERE u.correo = '".$correo."'
                                            )
                                        )
                                        GROUP BY rhi.Ingredientes_idIngredientes, rhi.unidad_medida, i.nombre";
            
            // Guarda el resultado de la consulta
            $ResultadoIngredientesPedidos = mysqli_query($conex, $QueryIngredientesPedidos);
            $numeroRegistros = mysqli_num_rows($ResultadoIngredientesPedidos);

            if ($numeroRegistros > 0) {
                $Respuesta['entregas'] = array();
            
                while ($RenglonEntrega = mysqli_fetch_assoc($ResultadoIngredientesPedidos)) {
                    $idIngredientePedido = $RenglonEntrega['idIngredientePedido'];
                    $cantidadPedida = $RenglonEntrega['cantidadPedida'];
                    $unidadMedida = $RenglonEntrega['unidadMedidaPedida'];
                    $nombreIngrediente = $RenglonEntrega['nombreIngredientePedido'];

                    if($unidadMedida === "Pieza(s)"){
                        // Si son piezas, como no necesita conversión, consulta si hay ingredientes disponibles
                        $QueryReadIngredientesDisponibles = "SELECT * FROM usuario_has_ingredientes
                                                            WHERE ingrediente_id = '".$idIngredientePedido."'
                                                            AND unidad_medida = 'Pieza(s)'
                                                            AND usuario_correo = '".$correo."'";

                        $ResultadoReadIngredientesDisponibles = mysqli_query($conex, $QueryReadIngredientesDisponibles);
                        if($ResultadoReadIngredientesDisponibles && mysqli_num_rows($ResultadoReadIngredientesDisponibles) > 0) {
                            $filaIngD = mysqli_fetch_assoc($ResultadoReadIngredientesDisponibles);
                            $cantidadDisponible = $filaIngD['cantidad'];

                            if($cantidadDisponible < $cantidadPedida){
                                $cantidadTotalIngrediente = ceil($cantidadPedida - $cantidadDisponible);

                                $Entrega = array();
                                $Entrega['nombreIngrediente'] = $nombreIngrediente;
                                $Entrega['cantidadTotalIngrediente']= $cantidadTotalIngrediente;
                                $Entrega['unidadMedida'] = $unidadMedida;

                                array_push($Respuesta['entregas'], $Entrega);
                                $Respuesta['estado'] = 1;
                                $Respuesta['mensaje'] = "Los registros se listan correctamente";
                            }
                            
                        }else{
                            $cantidadTotalIngrediente = ceil($cantidadPedida);
                            $Entrega = array();
                            $Entrega['nombreIngrediente'] = $nombreIngrediente;
                            $Entrega['cantidadTotalIngrediente']= $cantidadTotalIngrediente;
                            $Entrega['unidadMedida'] = $unidadMedida;

                            array_push($Respuesta['entregas'], $Entrega);
                            $Respuesta['estado'] = 1;
                            $Respuesta['mensaje'] = "Los registros se listan correctamente";
                        }
                        
                    }else{                              // Si son de otra unidad de medida, hay que convertir a Kg o L
                        // Kilogramo(s) o Litro(s) = 1
                        if($unidadMedida === "Kilogramo(s)" || $unidadMedida === "Litro(s)"){
                            $cantidadPedidaN = $cantidadPedida;
                        }
                        // Gramos o mililitros = 0.001
                        if($unidadMedida === "Gramos" || $unidadMedida === "Mililitros"){
                            $cantidadPedidaN = ($cantidadPedida * 0.001);
                        }
                        // Taza(s) = 0.236588
                        if($unidadMedida === "Taza(s)"){
                            $cantidadPedidaN = ($cantidadPedida * 0.236588);
                        }
                        // Cucharada(s) = 0.0147868
                        if($unidadMedida === "Cucharada(s)"){
                            $cantidadPedidaN = ($cantidadPedida * 0.0147868);
                        }
                        // Cucharadita(s) = 0.00492892
                        if($unidadMedida === "Cucharadita(s)"){
                            $cantidadPedidaN = ($cantidadPedida * 0.00492892);
                        }

                        $Entrega = array();
                        
                        $ingredientesRepetidos = array_filter($Respuesta['entregas'], function ($item) use ($nombreIngrediente) {
                            return $item['nombreIngrediente'] == $nombreIngrediente 
                                && $item['unidadMedida'] == "Kilogramo(s) o litro(s)" 
                                && $item['cantidadTotalIngrediente'];
                        });
                        
                        $encontrado = false;
                        foreach ($Respuesta['entregas'] as &$entrega) {
                            if ($entrega['nombreIngrediente'] == $nombreIngrediente && $entrega['unidadMedida'] == "Kilogramo(s) o litro(s)") {
                                $entrega['cantidadTotalIngrediente'] += $cantidadPedidaN;
                                $entrega['cantidadTotalIngrediente'] = ceil($entrega['cantidadTotalIngrediente'] * 100) / 100; // Redondear hacia arriba con 2 decimales
                                $entrega['cantidadTotalIngrediente'] = number_format($entrega['cantidadTotalIngrediente'], 2); // Formatear con 2 decimales

                                $encontrado = true;
                                break;
                            }
                        }

                        if (!$encontrado) {
                            // Crear un nuevo registro de entrega para el ingrediente
                            $Entrega['nombreIngrediente'] = $nombreIngrediente;
                            $Entrega['cantidadTotalIngrediente'] = $cantidadPedidaN;
                            $Entrega['cantidadTotalIngrediente'] = ceil($Entrega['cantidadTotalIngrediente'] * 100) / 100; // Redondear hacia arriba con 2 decimales
                            $Entrega['cantidadTotalIngrediente'] = number_format($Entrega['cantidadTotalIngrediente'], 2); // Formatear con 2 decimales
                            $Entrega['unidadMedida'] = "Kilogramo(s) o litro(s)";
                            array_push($Respuesta['entregas'], $Entrega);
                        }
                        
                    }
                }

                // Comprueba si hay ingredientes disponibles, para el caso de Kg o L
                $entregasFiltradas = array(); // Nuevo arreglo para almacenar las entregas filtradas

                foreach ($Respuesta['entregas'] as &$entrega) {
                    if ($entrega['unidadMedida'] == "Kilogramo(s) o litro(s)") {
                        $QueryReadIngredientesDisponibles = "SELECT ui.*, i.*
                                                            FROM usuario_has_ingredientes ui
                                                            JOIN ingredientes i ON ui.ingrediente_id = i.idIngredientes
                                                            WHERE ui.usuario_correo = '".$correo."'
                                                                AND NOT(ui.unidad_medida = 'Pieza(s)')
                                                                AND i.nombre = '".$entrega['nombreIngrediente']."'";

                        $ResultadoReadIngredientesDisponibles = mysqli_query($conex, $QueryReadIngredientesDisponibles);
                        if($ResultadoReadIngredientesDisponibles && mysqli_num_rows($ResultadoReadIngredientesDisponibles) > 0) {
                            $filaIngD = mysqli_fetch_assoc($ResultadoReadIngredientesDisponibles);
                            $cantidadDisponible = $filaIngD['cantidad'];

                            if($cantidadDisponible < $entrega['cantidadTotalIngrediente']){
                                // Restar la cantidad disponible de la cantidad total de ingredientes
                                $entrega['cantidadTotalIngrediente'] -= $cantidadDisponible;
                                $entrega['cantidadTotalIngrediente'] = ceil($entrega['cantidadTotalIngrediente'] * 100) / 100; // Redondear hacia arriba con 2 decimales
                                $entrega['cantidadTotalIngrediente'] = number_format($entrega['cantidadTotalIngrediente'], 2); // Formatear con 2 decimales
                                
                                if ($entrega['cantidadTotalIngrediente'] > 0) {
                                    $entregasFiltradas[] = $entrega; // Agregar entrega al arreglo filtrado
                                }
                            }
                        } else {
                            $entregasFiltradas[] = $entrega; // Agregar entrega al arreglo filtrado
                        }
                    } else {
                        $entregasFiltradas[] = $entrega; // Agregar entrega al arreglo filtrado
                    }
                }

                $Respuesta['entregas'] = $entregasFiltradas; // Actualizar $Respuesta con las entregas filtradas

                $Respuesta['estado'] = 1;
                $Respuesta['mensaje'] = "Los registros se listan correctamente";
                

            }else{
                $Respuesta['estado'] = 0;
                $Respuesta['mensaje'] = "Ocurrio un error desconocido";
            }
        }else{
            $Respuesta['estado'] = 0;
            $Respuesta['mensaje'] = "Ocurrio un error desconocido";
        }

        echo json_encode($Respuesta);
        mysqli_close($conex); 
    }
?>
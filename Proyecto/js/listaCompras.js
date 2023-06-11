/*  LISTA DE COMPRAS - APRS
* Pone en la tabla todos los registros de la BD
* Hace las conversiones de las unidades de medida
* Hace el cálculo de la cantidad tomando en cuenta los ingredientes necesarios para la receta y los disponibles
* Lo hace con las recetas que se tienen en la planeación
*/
async function actionRead() {
  const email = await obtenerCorreo();

  $.ajax({
    method:"POST",
    url: "../php/listaCompras.php",
    data: {
      accion: "read",
      correo: email
    },
    success: function( respuesta ) {
      JSONRespuesta = JSON.parse(respuesta);
      console.log(JSONRespuesta);
      if(JSONRespuesta.estado==1){
        //alert(JSONRespuesta.mensaje);
        tabla = $("#datatable-buttons").DataTable();
            JSONRespuesta.entregas.forEach(listaC => {
              tabla.row.add([listaC.nombreIngrediente, listaC.cantidadTotalIngrediente, listaC.unidadMedida]).draw();
            });
      } 
      console.log(respuesta);
    }
  });
}

//Leemos el correo de la sesion
async function obtenerCorreo() {
  const response = await fetch("../php/session.php");
  const data = await response.json();
  const user = data.correo;
  return user;
}
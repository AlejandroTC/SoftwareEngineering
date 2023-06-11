function actionCreate(idReceta) {
  var no_porciones = document.getElementById("no_porciones_planeacion").value;
  var idReceta = idReceta;

  var datos = {
    no_porciones: no_porciones,
    idReceta: idReceta
  };

  $.ajax({
    url: "../php/recuperarPorciones.php",
    type: "POST",
    data: datos,
    dataType: "json",
    success: function(response) {
      if (response.success) {
        alert(response.message); // Mostrar mensaje de éxito
        // Realizar acciones adicionales si es necesario
      } else {
        alert(response.message); // Mostrar mensaje de error
      }
    },
    error: function(xhr, status, error) {
      console.log(xhr.responseText); // Mostrar el mensaje de error en la consola
    }
  });
}


function actionDelete(idReceta) {
  var idReceta = idReceta;

  var datos2 = {
      idReceta: idReceta
  };

  $.ajax({
    url: "../php/deletePlaneacion.php",
    type: "POST",
    data: datos2,
    dataType: "json", // Especificar que esperamos una respuesta en formato JSON
    success: function(response) {
      // Analizar la respuesta JSON
      if (response.success) {
        alert(response.message); // Mostrar el mensaje de éxito
        window.location = '../html/planeacion.html'; // Redireccionar si es necesario
      } else {
        alert(response.message); // Mostrar el mensaje de error
        // Puedes realizar otras acciones según sea necesario en caso de error
      }
    }
  });
}


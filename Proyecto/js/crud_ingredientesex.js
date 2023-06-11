fetch("../php/ingredientes.php") //Pedimos en la base de datos los ingredientes existentes
    .then((response) => response.json())
    .then((data) => {
        let ingre = data; //Guardamos los resultados de php
        let nombres = ingre.map((obj) => obj.nombre); //Sacamos el nombre de los resultados
        $("#autocomplete-custom-append").autocomplete({ lookup: nombres }); //Autocompletamos el campo
    })
    .catch((error) => console.error(error));
    

//----------------CREATE-----------------
async function actionCreate()
{
    //Recuperamos los datos del formulario
    let nombre = document.getElementById('autocomplete-custom-append').value;
    let cantidad = document.getElementById('cantidad').value;
    if(cantidad === '0')
    {
      console.log('me diste un click');
      alert("Favor de poner un número positivo en la cantidad")
    }
    else
    {
      let unidad_medida = document.getElementById('unidad_medida').value;
      const email = await obtenerCorreo();

    if(nombre === '' || cantidad === '' || unidad_medida === '')
    {
      alert("Por favor llene todos los campos");
    }
    else
    {
      console.log(nombre);
    console.log(cantidad);
    console.log(unidad_medida);
    console.log(email);
    limpiarpagina();

    fetch('../php/crud_ingredientesex.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre,
          cantidad,
          unidad_medida,
          email,
          accion : 'create'
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if(data.Respuesta === 1){
          alert("Los datos se han guardado exitosamente");
          //actionRead();
        }
        else{
          alert("Fallo al guardar los datos");
        }
    });
    }
    }     
}

//----------------READ-----------------
/*function actionRead() {
  $.ajax({
    method:"POST",
    url: "../php/crud_ingredientesex.php",
    data: {
      accion: "read"
    },
    success: function( respuesta ) {
      
      JSONRespuesta = JSON.parse(respuesta);
      
      if(JSONRespuesta.estado==1){
        //Mostrar los registros = categorias en la tabla
        tabla = $("#dataTable").DataTable();

            //Ciclo for para leer la categoria del arreglo
            JSONRespuesta.ingredeintes.forEach(categoria => {
              let Botones ='<a class="btn btn-warning btn-sm" data-toggle="modal" data-target="#modal-lg-subtemas" href="#" ><i class="fas fa-clock"></i></a>';
              Botones +=' <a class="btn btn-primary btn-sm" href="#" data-toggle="modal" data-target="#modal-update" onclick="identificarActualizar('+categoria.idDisponible+')"><i class="fas fa-edit"></i></a>';
              Botones +=' <a class="btn btn-danger btn-sm" href="#" data-toggle="modal" data-target="#modal-delete" onclick="identificarEliminar('+categoria.idDisponible+')"><i class="fas fa-trash"></i></a>';
          
              tabla.row.add([categoria.id_ingredientes,
                            categoria.cantidad,
                            categoria.unidad_medida,
                            Botones]).draw().node().id="renglon_"+categoria.idDisponible;

            });

      } 
      //console.log(respuesta);
      //Mostrar todos los registros en la tabla
    }
  });
}
*/

//----------------DELATE-----------------



//----------------UPDATE-----------------


//Limpiar las variables del formulario
function limpiarpagina()
{
    document.getElementById("autocomplete-custom-append").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("unidad_medida").value = "";
}

//Leemos el correo de la sesion
async function obtenerCorreo() {
    const response = await fetch("../php/session.php");
    const data = await response.json();
    const user = data.correo;
    return user;
}

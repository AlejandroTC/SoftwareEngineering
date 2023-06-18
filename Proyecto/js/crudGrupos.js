//----------------Imagen del grupo----------
const fileInput = document.getElementById("gimg");
fileInput.addEventListener("change", function () {
    const file = fileInput.files[0];

    if (file) {
        // Se ha seleccionado un archivo
        const reader = new FileReader();

        reader.addEventListener("load", function () {
            profileImage.src = reader.result;
            profileImageVisitor.src = reader.result;
        });
        reader.readAsDataURL(file);
    } else {
        // No se ha seleccionado ningún archivo
        profileImage.src = "";
        profileImageVisitor.src = "";
    }
});
//-------------Nombre del grupo----------
const nombreInput = document.getElementById("nombreGrupo");
const nombreGrupoPreview = document.getElementById("nombreGrupoPreview");
const nombreGrupoPreviewVisitor = document.getElementById(
    "nombreGrupoPreviewVisitor"
);

nombreInput.addEventListener("input", function () {
    const nuevoNombre = nombreInput.value;
    nombreGrupoPreview.textContent = nuevoNombre;
    nombreGrupoPreviewVisitor.textContent = nuevoNombre;
});

//-----------Correo----------------------
const correoPreview = document.getElementById("correoVisitor");
obtenerCorreo()
    .then((user) => {
        correoPreview.textContent = user;
    })
    .catch((error) => {
        console.error("Error al obtener el correo:", error);
    });

//-------------descripcion del grupo----------
const descripcionInput = document.getElementById("descripcion");
const descripcionGrupo = document.getElementById("descripcionGrupoPreview");

descripcionInput.addEventListener("input", function () {
    const nuevaDescripcion = descripcionInput.value;
    descripcionGrupo.textContent = nuevaDescripcion;
});
//Codigo
function generarCodigoAleatorio() {
    const letrasMayusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numeros = "0123456789";
    const letrasMinusculas = "abcdefghijklmnopqrstuvwxyz";

    const letraAleatoria = letrasMayusculas.charAt(
        Math.floor(Math.random() * letrasMayusculas.length)
    );
    const numeroAleatorio = Math.floor(Math.random() * 1000);
    const letraMinusculaAleatoria = letrasMinusculas.charAt(
        Math.floor(Math.random() * letrasMinusculas.length)
    );

    const codigoAleatorio = `${letraAleatoria}${numeroAleatorio
        .toString()
        .padStart(3, "0")}${letraMinusculaAleatoria}`;
    return codigoAleatorio;
}

const codigoElemento = document.getElementById("codigo");
const codigoElementoPreview = document.getElementById("codigoPreview");
codigoElemento.textContent = generarCodigoAleatorio();
codigoElementoPreview.textContent = codigoElemento.textContent;

//----------------CREATE----------------- Funciona
async function actionCreate() {
    // Recuperamos los datos del formulario
    let nombre = document.getElementById("nombreGrupo").value;
    let descripcion = document.getElementById("descripcion").value;
    let codigo = document.getElementById("codigo").textContent;
    const gImg = document.getElementById("gimg").files[0];

    // Verificar si algún campo está vacío
    if (
        nombre.trim() === "" ||
        descripcion.trim() === "" ||
        codigo.trim() === ""
    ) {
        // Al menos uno de los campos está vacío
        console.log("Uno o más campos están vacíos");
    } else {
        const reader = new FileReader();
        reader.onload = () => {
            const blob = new Blob([reader.result], { type: gImg.type });
            // Llamar a la función para enviar los datos a la base de datos
            crearGrupo(nombre, codigo, descripcion, blob);
        };
        reader.readAsArrayBuffer(gImg);
        console.log("Todos los campos tienen un valor");
    }
}

function crearGrupo(nombre, codigo, descripcion, blob) {
    // Crear el objeto FormData y agregar los campos
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("clave", codigo);
    formData.append("descripcion", descripcion);
    formData.append("imagen", blob, "imagen.jpg");

    fetch("../php/createGrupo.php", {
        method: "POST",
        body: formData
    })
        .then((response) => {
            console.log("Se añadió el grupo"); // Mostrar en la consola que se añadió
            // Realizar las acciones adicionales después de añadir el grupo
        })
        .catch((error) => {
            console.error(error); // Mostrar el error si hubo
        });
}

//----------------UPDATE-----------------
function cambiarBotonAgregar(id) {
    var btnAgregarIn = document.getElementById("agregarin");

    if (btnAgregarIn.innerText === "Agregar") {
        let idingredientes = id;
        // Cambiar el texto y la función
        btnAgregarIn.innerText = "Actualizar";
        $.ajax({
            method: "POST",
            url: "../php/crud_ingredientesex.php",
            data: {
                id: idingredientes,
                accion: "read_id"
            },
            success: function (respuesta) {
                JSONRespuesta = JSON.parse(respuesta);
                if (JSONRespuesta.estado == 1) {
                    let nom_ingrediente = document.getElementById(
                        "autocomplete-custom-append"
                    );
                    nom_ingrediente.value = JSONRespuesta.nombre_ingrediente;
                    let cantidad = document.getElementById("cantidad");
                    cantidad.value = JSONRespuesta.cantidad;
                    let unidad = document.getElementById("unidad_medida");
                    unidad.value = JSONRespuesta.unidad_medida;
                } else {
                    alert("Registro no encontrado");
                }
            }
        });
        btnAgregarIn.onclick = function () {
            actionUpdate(idingredientes);
        };
    } else {
        // Restaurar el texto y la función originales
        btnAgregarIn.innerText = "Agregar";
        btnAgregarIn.onclick = actionCreate;
    }
}

async function actionUpdate(id) {
    let nom_ingrediente = document.getElementById(
        "autocomplete-custom-append"
    ).value;
    let cantidad = document.getElementById("cantidad").value;
    let unidad = document.getElementById("unidad_medida").value;
    const email = await obtenerCorreo();
    console.log(id);
    console.log(nom_ingrediente);
    console.log(cantidad);
    console.log(unidad);
    $.ajax({
        method: "POST",
        url: "../php/crud_ingredientesex.php",
        data: {
            iding: id,
            nom: nom_ingrediente,
            cant: cantidad,
            unid: unidad,
            correo: email,
            accion: "update"
        },
        success: function (respuesta) {
            JSONRespuesta = JSON.parse(respuesta);
            console.log(respuesta);
            if (JSONRespuesta.estado == 1) {
                let tabla = $("#example").DataTable();
                let Botones = "";
                Botones +=
                    '<button type="button" id="editarIngrediente" class="btn btn-primary" onclick="cambiarBotonAgregar(' +
                    id +
                    ')"><i class="fa fa-pencil"></i></button>';
                Botones +=
                    '<button type="button" id="eliminarIngrediente" class="btn btn-danger" data-toggle="modal" data-target="#modal_delete_ingrediente" onclick="actionDelete(' +
                    id +
                    ')"><i class="fa fa-trash"></i></button>';
                ////////////////////////////////////////////////
                var temp = tabla.row("#renglon_" + id).data();
                temp[0] = nom_ingrediente;
                temp[1] = cantidad;
                temp[2] = unidad;
                temp[3] = Botones;
                tabla
                    .row("#renglon_" + id)
                    .data(temp)
                    .draw();
                /////////////////////////////////////////////////
                alert("Ingrediente actualizado correctamente");
                limpiarpagina();
                cambiarBotonAgregar();
            } else {
                alert(
                    "Error al actualizar el ingrediente, intentelo nuevamente"
                );
            }
        }
    });
    fetch("../php/ingredientes.php") //Pedimos en la base de datos los ingredientes existentes
        .then((response) => response.json())
        .then((data) => {
            let ingre = data; //Guardamos los resultados de php
            let nombres = ingre.map((obj) => obj.nombre); //Sacamos el nombre de los resultados
            $("#autocomplete-custom-append").autocomplete({ lookup: nombres }); //Autocompletamos el campo
        })
        .catch((error) => console.error(error));
}

//Cerar el formulario
function Cerrar() {
    var btnAgregar = document.getElementById("agregar");

    if (btnAgregar.innerText === "Actualizar") {
        btnAgregar.innerText = "Agregar";
        btnAgregar.onclick = actionCreate;
    }
    limpiarpagina();
}

//Limpiar las variables del formulario
function limpiarpagina() {
    document.getElementById("nombreGrupo").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("codigo").textContent = "";
}

//Leemos el correo de la sesion
async function obtenerCorreo() {
    const response = await fetch("../php/session.php");
    const data = await response.json();
    const user = data.correo;
    return user;
}

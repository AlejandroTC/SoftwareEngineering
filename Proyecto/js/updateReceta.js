import { Receta } from "./recetaclass.js"; //Clase receta para guardar datos
import { Ingrediente } from "./recetaclass.js"; //Clase receta para guardar datos
import { pasosBlob } from "./procedimiento.js";
// console.log("ID de la receta:", idReceta);
const ingres = {}; //Arreglo de ingredientes
obtenerDetallesReceta(idReceta);
llenarTabla();
llenarTablaPasos();

const logoutB = document.getElementById("logout");
logoutB.addEventListener("click", function () {
    // Enviar petición al servidor para cerrar la sesión
    fetch("../php/logout.php", { method: "POST" })
        .then((response) => {
            // Si la petición es exitosa, redirigir al usuario a la página de inicio de sesión
            window.location.href = "../html/index.html";
        })
        .catch((error) => {
            console.error("Error al cerrar la sesión:", error);
        });
});

//Recuperar toda la receta y pasos
function obtenerDetallesReceta(idReceta) {
    fetch("../php/insertarDB.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body:
            'sql=SELECT nombre, duracion, tiempo_comida, tiempo_receta, porciones, Usuarios_correo FROM recetas WHERE idRecetas="' +
            idReceta +
            '";'
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            llenarcampos(
                data[0].nombre,
                data[0].duracion,
                data[0].tiempo_comida,
                data[0].tiempo_receta,
                data[0].porciones
            );
        })
        .catch((error) => console.log(error));
}

// Función para obtener los datos de ingredientes de la base de datos y procesarlos
async function llenarTabla() {
    const response = await fetch("../php/insertarDB.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body:
            'sql=SELECT * FROM recetas_has_ingredientes WHERE Recetas_idRecetas="' +
            idReceta +
            '";'
    });
    const data = await response.json();

    const tbody = document
        .getElementById("listaingredientes")
        .querySelector("tbody");

    data.forEach((obj) => {
        const NIName = obj.Ingredientes_idIngredientes;
        const NIQuantity = obj.cantidad;
        const NIUnit = obj.unidad_medida;
        const ulingredient = NIQuantity + " " + NIUnit + " de " + NIName;

        const tr = document.createElement("tr");
        const tdRemove = document.createElement("td");
        tdRemove.className = "col-md-1 col-sm-1";
        const icon = document.createElement("i");
        icon.classList.add("fa", "fa-times-circle-o");
        icon.style.color = "rgb(255, 0, 89)";
        icon.style.textAlign = "right";
        icon.style.cursor = "pointer";
        icon.onclick = eliminarFila;
        const tdtext = document.createElement("td");
        tdtext.className = "col-md-11 col-sm-11";
        let txt = document.createTextNode(ulingredient);
        tdtext.appendChild(txt);
        tdRemove.appendChild(icon);
        tr.appendChild(tdRemove);
        tr.appendChild(tdtext);
        tbody.appendChild(tr);
    });
}
async function llenarTablaPasos() {
    const response = await fetch("../php/insertarDB.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body:
            'sql=SELECT idPasos, nopaso, paso FROM pasos WHERE Recetas_idRecetas="' +
            idReceta +
            '";'
    });
    const data = await response.json();

    const tbody = document
        .getElementById("procedimiento")
        .querySelector("tbody");

    data.forEach((obj) => {
        const NStep = obj.nopaso;
        const Step = obj.paso;

        const tr = document.createElement("tr");
        const tdRemove = document.createElement("td");
        tdRemove.className = "col-md-1 col-sm-1";
        const icon = document.createElement("i");
        icon.classList.add("fa", "fa-times-circle-o");
        icon.style.color = "rgb(255, 0, 89)";
        icon.style.textAlign = "right";
        icon.style.cursor = "pointer";
        icon.onclick = eliminarFila;
        const tdtext = document.createElement("td");
        tdtext.className = "col-md-11 col-sm-11";
        let txt = document.createTextNode("Paso " + NStep + ". " + Step);
        tdtext.appendChild(txt);
        tdRemove.appendChild(icon);
        tr.appendChild(tdRemove);
        tr.appendChild(tdtext);
        tbody.appendChild(tr);
    });
}

async function llenarcampos(
    nombreReceta,
    duracion,
    porciones,
    tiempoComida,
    tipoReceta
) {
    // Llenar el campo "Nombre de la receta"
    document.querySelector("#nombrereceta").value = nombreReceta;

    // Llenar el campo "Duración"
    document.querySelector("#rduracion").value = duracion;

    // Llenar el campo "Porciones"
    document.querySelector("#rporcion").value = porciones;

    // Llenar el campo "Tiempo de comida"
    const tiempoComidaSelect = document.querySelector("#rtiempo");
    for (let i = 0; i < tiempoComidaSelect.options.length; i++) {
        if (tiempoComidaSelect.options[i].value === tiempoComida) {
            tiempoComidaSelect.selectedIndex = i;
            break;
        }
    }

    // Llenar el campo "Tipo de receta"
    const tipoRecetaSelect = document.querySelector("#rtipo");
    for (let i = 0; i < tipoRecetaSelect.options.length; i++) {
        if (tipoRecetaSelect.options[i].value === tipoReceta) {
            tipoRecetaSelect.selectedIndex = i;
            break;
        }
    }
}
function eliminarFila() {
    const tr = this.closest("tr");
    const tdtext = tr.querySelector("td:nth-child(2)").textContent;
    const ingEliminar = tdtext.split("de")[1].trim();
    delete ingres[ingEliminar];
    tr.remove();
}
//Limpiamos el formulario de los ingredientes
function limpiaringre() {
    document.getElementById("autocomplete-custom-append").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("unidad_medida").value = "";
}

let updateButton = document.getElementById("actualizar"); //Variable global para el boton receta agregar
const receta = new Receta(); //Variable global para la instancia de la clase Receta
const ingredientes = [];
const ingredientesReceta = [];

//Cuando se presione el boton guardar receta al final de la pagina
updateButton.onclick = function () {
    setTimeout(function () {
        comprobarTablas();
    }, 1000);
};

//Lectura de los datos ingresados en la receta para saber si estan completos o vacios para guardarlos en la clase posteriormente
async function leerDatosReceta() {
    //Se instancian e inicializan los datos
    const rName = document.getElementById("nombrereceta").value;
    const rDuration = document.getElementById("rduracion").value;
    const rPortion = document.getElementById("rporcion").value;
    const rTime = document.getElementById("rtiempo").value;
    const rType = document.getElementById("rtipo").value;
    const rImg = document.getElementById("rimg").files[0];
    const email = await obtenerCorreo();
    //Comprobamos si estan completos
    if (
        rName == "" ||
        rDuration == "" ||
        rPortion == "" ||
        rTime == "" ||
        rType == "" ||
        rImg === undefined ||
        rImg == null ||
        rImg.name === ""
    ) {
        //No estan completos
        alert("Por favor, complete todos los campos y seleccione una imagen.");
        return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
        const blob = new Blob([reader.result], { type: rImg.type });
        //Creamos la receta para guardar los datos
        receta.setName(rName);
        receta.setDuration(rDuration);
        receta.setPortion(rPortion);
        receta.setTime(rTime);
        receta.setType(rType);
        receta.setImage(blob);
        receta.setEmail(email);
        console.log("Guardando imagen");
        imprimirDatosReceta(); //Debug
        await updateRecipe();
    };
    reader.readAsArrayBuffer(rImg);
}

//Comprobar los datos de la receta, es con fines de debugin
function imprimirDatosReceta() {
    console.log("Aqui inicia la receta");
    console.log("Nombre de la receta: ", receta.getName());
    console.log("Duracion de la receta: ", receta.getDuration());
    console.log("Porcion de la receta: ", receta.getPortion());
    console.log("Tiempo de la receta: ", receta.getTime());
    console.log("Tipo de la receta: ", receta.getType());
    console.log("Imagen de la receta: ", receta.getImage());
    console.log("Mail de la receta: ", receta.getEmail());
    console.log("Id de la receta: ", receta.getId());
    console.log("Aqui termina la receta");
}

//Leemos el correo de la sesion
async function obtenerCorreo() {
    const response = await fetch("../php/session.php");
    const data = await response.json();
    const user = data.correo;
    console.log("ObtenerCorreo()", data.correo); //debug
    return user;
}
//------------------------Receta datos y acciones----------------------------
//Ingresamos la receta a la base de datos
async function updateRecipe() {
    let rName = receta.getName();
    let rDuration = receta.getDuration();
    let rTime = receta.getTime();
    let rType = receta.getType();
    let rPortion = receta.getPortion();
    let rimg = receta.getImage();
    let correo = receta.getEmail();

    // Crear un objeto FormData y agregar la imagen como un campo "imagen"
    const formData = new FormData();
    formData.append("imagen", rimg, "imagen.jpg");

    // Agregar los demás campos a la solicitud
    formData.append("nombre", rName);
    formData.append("duracion", rDuration);
    formData.append("tiempo_comida", rTime);
    formData.append("tiempo_receta", rType);
    formData.append("porciones", rPortion);
    formData.append("usuarios_correo", correo);

    fetch("../php/updateRecetas.php", {
        // Peticion php para guardar cosas en DB
        method: "POST",
        body: formData // Enviar el objeto FormData en lugar de una cadena de consulta
    })
        .then((response) => console.log("Se actualizo la receta")) //Mostrar en la consola que se añadio
        .catch((error) => console.error(error)); //Mostrar el error si es que hubo

    setTimeout(async function () {
        let idReceta = await obtenerIdReceta();
        console.log(idReceta); // Debug
        receta.setId(idReceta);
        await DbIngredients();
    }, 5000);
}

//Obtener el id de la receta
async function obtenerIdReceta() {
    let rName = receta.getName();
    let rDuration = receta.getDuration();
    let rTime = receta.getTime();
    let rType = receta.getType();
    let correo = receta.getEmail();

    return new Promise((resolve, reject) => {
        fetch("../php/insertarDB.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:
                'sql=SELECT idRecetas FROM recetas WHERE nombre="' +
                rName +
                '" AND duracion="' +
                rDuration +
                '" AND tiempo_comida="' +
                rTime +
                '" AND tiempo_receta="' +
                rType +
                '" AND Usuarios_correo="' +
                correo +
                '";'
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                resolve(parseInt(data[0].idRecetas));
            })
            .catch((error) => reject(error));
    });
}
//--------------------Ingredientes datos y acciones --------------------------
//Funcion para obtener los ingredientes de la tabla
async function DbIngredients() {
    //revisamos ingredientes para insertar los que no existan
    const table = document.querySelector("#listaingredientes"); // Obtener la tabla
    const tds = table.querySelectorAll("td:not(.col-md-1)"); // Obtener todos los td que no tienen clase "col-md-1"
    const texts = Array.from(tds).map((td) => td.textContent); // Obtener la cadena de texto de cada td y guardarlos en un array
    //Iterar el array y separarlo
    for (let i = 0; i < texts.length; i++) {
        const fila = texts[i]; //Del array obtener la cadena de la posicion i
        const split = fila.split(" "); //Partimos la cadena donde existan ' '
        const indiceDe = split.indexOf("de"); //Obtenemos la posicion del primer "de", recordemos que la sintexis es # unidad_de_medida de ingrediente,
        //pero puede ser tambien # unidad_de_medida de ingrediente de varias palabras, Harina de trigo, etc.
        const ingrediente = split.slice(indiceDe + 1).join(" "); //De la posicion del primer "de" se obtiene la cadena de despues
        let unitMedida = split[1]; //Aqui guardamos la unidad de medida
        let quantity = split[0]; //Aqui guardamos la cantidad
        if (unitMedida == "de") {
            const split2 = fila.split(" "); //Esto es por que recuerdo un error de separacion
            unitMedida = split2[3]; //Arreglamos el error
            quantity = split2[0]; //Arreglamos el error
        }
        //Guardamos en un arreglo los ingredientes de la receta
        let ingredienteReceta = new Ingrediente();
        ingredienteReceta.setName(ingrediente);
        ingredienteReceta.setUnit(unitMedida);
        ingredienteReceta.setQuantity(quantity);
        ingredientesReceta.push(ingredienteReceta);
        //Comprobamos los ingredientes de la receta en la base de datos
        await sendIngredient(ingrediente);
    }
    console.log(ingredientesReceta); //Debug
    await obtenerIdIngrediente();
}

//Funcion para leer los ingredientes de la BD y enviar si es que no esta
async function sendIngredient(ingrediente) {
    return fetch("../php/ingredientes.php") //Consulta a la DB por todos los ingredientes
        .then((response) => response.json()) //Obtenemos respuesta en JSON
        .then((data) => {
            //Guardar el contenido del JSON en data
            let ingre = data; //Pasar el contenido del data
            let nombres = ingre.map((obj) => obj.nombre); //Convertimos el contenido JSON de objeto => string, lista de ingredientes de la db
            ingre.forEach((obj) => {
                //Para cada ingrediente
                let ingredientedb = new Ingrediente(); //Creamos un objeto de Ingrediente, clase en recetaclass.js
                ingredientedb.setId(obj.idIngredientes); //Seteamos el id con el obtenido de la base de datos
                ingredientedb.setName(obj.nombre); //Seteamos el nombre con el obteeniodo de la base de datos
                ingredientes.push(ingredientedb); //Agregamos el ingrediente al arreglo de ingredientes de la base de datos
            });
            if (!nombres.includes(ingrediente)) {
                //Si no existe en la base de datos el ingrediente
                console.log("Ingrediente no existe en la BD");
                fetch("../php/insertarDB.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body:
                        'sql=INSERT INTO ingredientes (nombre) VALUES ("' + //Lo insertamos en la base de datos
                        ingrediente +
                        '")'
                })
                    .then((response) => console.log(response))
                    .catch((error) => console.error(error));
            }
        })
        .catch((error) => console.error(error));
}
//Obtenemos los ids de los ingredientes de la receta, en este caso se guardan en ingredientesReceta
//Sinceramente no se como funciona este codigo, pues al ser interpretado al momento de hacer debugg funciona pero
//No como lo pense la primera vez, pero funciona, aun asi lo intentare comentar un poco
async function obtenerIdIngrediente() {
    const promises = ingredientesReceta.map((ingrediente) => {
        //Promesa para usar await al momento de pedir ejecucion
        return new Promise((resolve, reject) => {
            fetch("../php/insertarDB.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body:
                    'sql=SELECT idIngredientes FROM ingredientes WHERE nombre="' + //Buscamos el id de los ingredientes de la bd
                    ingrediente.getName() +
                    '";'
            })
                .then((response) => response.json())
                .then((data) => {
                    const ingredienteEncontrado = ingredientesReceta.find(
                        //Creamos una variable con todos los ingredientes para buscar por nombre
                        (obj) => obj.getName() === ingrediente.getName() //Buscamos en los datos que recibimos del fetch el nombre del ingrediente
                    );
                    if (ingredienteEncontrado) {
                        //Si lo encontramos
                        let id = data[0].idIngredientes; //Guardamos el id del ingrediente
                        ingredienteEncontrado.setId(id); //Seteamos el id en la clase
                    }
                    resolve();
                })
                .catch((error) => reject(error));
        });
    });
    await Promise.all(promises); //Completar primero todas las promesas antes de continuar con la ejecucion del codigo
    await insertRecipeIngredients();
    await insertPasos();
}
//Ingresamos los ingredientes a la receta, en la tabla Receta_has_ingredientes
async function updateRecipeIngredients() {
    console.log("Inicio de actualización de ingredientes de la receta");
    let recetaId = receta.getId();
    for (const ingredienteReceta of ingredientesReceta) {
        const idIngredienteAgregar = ingredienteReceta.getId();
        const quantity = ingredienteReceta.getQuantity();
        const unitMedida = ingredienteReceta.getUnit();
        console.log("Receta tiene ingredientes: ", ingredienteReceta);
        try {
            const response = await fetch("../php/insertarDB.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body:
                    'sql=UPDATE recetas_has_ingredientes SET cantidad = "' +
                    quantity +
                    '", unidad_medida = "' +
                    unitMedida +
                    '" WHERE Recetas_idRecetas = "' +
                    recetaId +
                    '" AND Ingredientes_idIngredientes = "' +
                    idIngredienteAgregar +
                    '"'
            });

            console.log("Ingrediente actualizado en la receta"); //Depuración
        } catch (error) {
            console.error("Error al actualizar el ingrediente en la receta:", error); //Depuración
        }
    }
}


//----------------Pasos-----------------------
//Insertar los pasos en la tabla pasos
//Esto hay que modificarlo si vamos a introducir el blob en las imagenes
async function updatePasos() {
    try {
        let recetaId = receta.getId();
        const tablepro = document.querySelector("#procedimiento"); // Obtener la tabla
        const tdspro = tablepro.querySelectorAll("td:not(.col-md-1)"); // Obtener todos los td que no tienen clase "col-md-1"
        const textspro = Array.from(tdspro).map((td) => td.textContent); // Obtener la cadena de texto de cada td y guardarlos en un array
        //Ahora buscamos dos cosas, que exista imagen o que no exista imagen
        for (let i = 0; i < textspro.length; i++) {
            const filaproce = textspro[i]; //Del array obtener la cadena de la posicion i
            const regex = /^Paso\s(\d+)\.\s(.+)\.$/; //Sintaxis de referencia Paso #. descripcion del paso.
            console.log(filaproce); //Debugg
            if (regex.test(filaproce)) {
                //Si el texto coincide con la sintaxis de referencia, entonces no hay imagen
                console.log("No imagen"); //Debugg
                const partes = filaproce.match(regex); //Comparar las cadenas para saber las partes y separarlas
                const numeroPaso = partes[1]; //Aqui se guarda el numero de paso
                const descripcion = partes[2]; //Aqui se guarda la descripcion del paso
                fetch("../php/insertarDB.php", {
                    //Peticion php para actualizar los pasos en la DB
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body:
                        'sql=UPDATE pasos SET paso = "' +
                        descripcion +
                        '" WHERE Recetas_idRecetas = "' +
                        recetaId +
                        '" AND nopaso = "' +
                        numeroPaso +
                        '"'
                })
                    .then((response) => response.json())
                    .then((data) =>
                        console.log("Se actualizó el paso:", filaproce)
                    ) //Debugg
                    .catch((error) => console.error(error));
            } else {
                //Si no era igual a la sintexis entonces significa que tiene imagen y entonces hay que contemplar eso
                console.log("Tiene imagen"); //Debugg
                const regexIm =
                    /^Paso\s(\d+)\.\s([\w\s]+)\.\s([\w\s]+\.(jpg|jpeg|png|gif))$/i;
                const partesIm = filaproce.match(regexIm); //Comparar las cadenas para saber las partes y separarlas
                const numeroPasoIm = partesIm[1]; //Aqui se guarda el numero del paso
                const descripcionIm = partesIm[2]; //Aqui se guarda la descripcion del paso

                //Iterar por el array de blobs
                let blobPaso;
                for (let i = 0; i < pasosBlob.length; i++) {
                    if (
                        parseInt(pasosBlob[i].numero) === parseInt(numeroPasoIm)
                    ) {
                        blobPaso = pasosBlob[i].blob;
                        break; // Salir del loop cuando se encuentre el objeto correspondiente
                    }
                }
                const formData = new FormData();
                formData.append("nopaso", numeroPasoIm);
                formData.append("paso", descripcionIm);
                formData.append("imagen", blobPaso, "imagen.jpg");
                formData.append("Recetas_idRecetas", recetaId);
                fetch("../php/updatePasosImg.php", {
                    method: "POST",
                    body: formData
                })
                    .then((response) => response.json())
                    .then((data) =>
                        console.log("Se actualizó el paso con imagen:", filaproce)
                    ) //Debugg
                    .catch((error) => console.error(error));
            }
        }
        await final();
    } catch (error) {
        console.error(error);
    }
}

//---------------------------Comprobaciones-----------------
//Revisamos las tablas para saber si existen pasos e ingredientes
async function comprobarTablas() {
    const table = document.querySelector("#listaingredientes"); // Obtener la tabla
    const tds = table.querySelectorAll("td:not(.col-md-1)"); // Obtener todos los td que no tienen clase "col-md-1"
    const texts = Array.from(tds).map((td) => td.textContent); // Obtener la cadena de texto de cada td y guardarlos en un array
    const tablepro = document.querySelector("#procedimiento"); // Obtener la tabla
    const tdspro = tablepro.querySelectorAll("td:not(.col-md-1)"); // Obtener todos los td que no tienen clase "col-md-1"
    const textspro = Array.from(tdspro).map((td) => td.textContent); // Obtener la cadena de texto de cada td y guardarlos en un array
    if (texts == "" || textspro == "") {
        alert("Por favor complete los ingredientes y pasos");
        return;
    }
    try {
        await leerDatosReceta();
    } catch (error) {
        console.error(error);
    }
}

async function final() {
    alert("Se guardó la receta");
    window.location.href = "./misRecetas.html";
}

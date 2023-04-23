/*
Documentacion del codigo
El siguiente codigo se desarrolla con nomenclatura camelCase, que se usa para variables, funciones y propiedades
    CamelCase se refiere a escribir palabras juntas sin espacios y cada palabra después de la primera comienza con una letra mayúscula, por ejemplo: miVariableDeEjemplo.
Hay que tener conocimiento de los terminos y funcionamiento de las promesas, funciones asincronas y por lo tanto async-await. Existen varios videos de esto, asi que dejo algunos:
    Video de FastCode 40 minutos, pero realmente es muy facil de ver y entender https://www.youtube.com/watch?v=Q3HtXuDEy5s&t=1951s
    Video de un man 10 minutos sencillo para entender lo basico de como funcionan https://www.youtube.com/watch?v=_1LK3dz2XsM
    Video de Codely 30 minutos explican que es la asincronia, promesas y varias cosas mas, es un poco tedioso de ver pero se entienden los conceptos https://www.youtube.com/watch?v=XHw7D7Kb9MY
Estoy usando tambien POO pues existen dos clases para objetos:
    Receta: que contiene el nombre, duracion, id y todos sus atributos para que no se modifiquen por la ejecucion asincrona del codigo
    Ingrediente: que contiene el nombre y el id de los ingredientes, se usa dos veces, para los ingredientes de la receta y para los ingredientes de la base de datos
ATC
*/
import { Receta } from "./recetaclass.js"; //Clase receta para guardar datos
import { Ingrediente } from "./recetaclass.js"; //Clase receta para guardar datos
import { Paso } from "./recetaclass.js";
let addButton = document.getElementById("guardarreceta"); //Variable global para el boton receta agregar
const receta = new Receta(); //Constante global para la instancia de la clase Receta
const ingredientes = []; //Constante para guardar los ingredientes existentes en la base de datos
//Cuando se presione el boton guardar receta al final de la pagina
addButton.onclick = function () {
    comprobarTablas();
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
    // Creamos un objeto FileReader
    const reader = new FileReader();
    // Leemos el contenido del archivo
    reader.readAsArrayBuffer(rImg);
    // Cuando se completa la lectura del archivo
    reader.onloadend = function () {
        // Obtenemos el blob de la imagen
        const blob = new Blob([reader.result], { type: rImg.type });
        //Creamos la receta para guardar los datos
        receta.setName(rName);
        receta.setDuration(rDuration);
        receta.setPortion(rPortion);
        receta.setTime(rTime);
        receta.setType(rType);
        receta.setImage(blob);
        receta.setEmail(email);
    };
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
    
    await ingredientesReceta();
}
//Leemos el correo de la sesion
async function obtenerCorreo() {
    const response = await fetch("../php/session.php");
    const data = await response.json();
    const user = data.correo;
    return user;
}

//Funcion para obtener los ingredientes de la tabla
async function ingredientesReceta() {
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
        //Guardamos los ingredientes en la receta
        let ingredienteReceta = new Ingrediente();
        ingredienteReceta.setName(ingrediente);
        ingredienteReceta.setUnit(unitMedida);
        ingredienteReceta.setQuantity(quantity);
        receta.addIngredient(ingredienteReceta);
    }
    await pasosReceta();
}

//Funcion para obtener los ingredientes de la tabla
async function pasosReceta() {
    const tablepro = document.querySelector("#procedimiento"); // Obtener la tabla
    const tdspro = tablepro.querySelectorAll("td:not(.col-md-1)"); // Obtener todos los td que no tienen clase "col-md-1"
    const textspro = Array.from(tdspro).map((td) => td.textContent); // Obtener la cadena de texto de cada td y guardarlos en un array
    //Ahora guardamos en la receta
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
            let paso = new Paso();
            paso.setnumber(numeroPaso);
            paso.setExplication(descripcion);
            receta.addSteps(paso);
        } else {
            //Si no era igual a la sintexis entonces significa que tiene imagen y entonces hay que contemplar eso
            console.log("Tiene imagen"); //Debugg
            const partes = filaproce.match(regex); //Comparar las cadenas para saber las partes y separarlas
            const numeroPaso = partes[1]; //Aqui se guarda el numero del paso
            const descripcion = partes[2]; //Aqui se guarda la descripcion del paso
            // Recuperar el objeto Blob de la tabla
            const tdBlob = tr.getElementsByTagName("td")[2];
            const blob = tdBlob.firstChild;
            let paso = new Paso();
            paso.setnumber(numeroPaso);
            paso.setExplication(descripcion);
            paso.setImg(blob);
            receta.addSteps(paso);
        }
    }
    await imprimirDatosReceta(); //Debug
    await addRecipe();
}

//Comprobar los datos de la receta, es con fines de debugin
async function imprimirDatosReceta() {
    console.log("Name:", receta.getName());
    console.log("Duration:", receta.getDuration());
    console.log("Portion:", receta.getPortion());
    console.log("Time:", receta.getTime());
    console.log("Type:", receta.getType());
    console.log("Image:", receta.getImage());
    console.log("Email:", receta.getEmail());
    console.log("ID:", receta.getId());

    console.log("Ingredients:");
    for (const ingrediente of receta.getIngredients()) {
        console.log(
            `\tName: ${ingrediente.getName()}, Quantity: ${ingrediente.getQuantity()}, Unit: ${ingrediente.getUnit()}`
        );
    }

    console.log("Steps:");
    for (const paso of receta.getSteps()) {
        console.log(
            `\tNumber: ${paso.getnumber()}, Explication: ${paso.getExplication()}, Image: ${paso.getImg()}`
        );
    }
}

//Enviar receta a la base de datos
async function addRecipe() {
    let rName = receta.getName();
    let rDuration = receta.getDuration();
    let rTime = receta.getTime();
    let rType = receta.getType();
    let rPortion = receta.getPortion();
    let rimg = receta.getImage();
    let correo = receta.getEmail();
    fetch("../php/insertarDB.php", {
        //Peticion php para guardar cosas en DB
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        //Sentencia para enviar la receta
        body:
            'sql=INSERT INTO recetas (nombre, duracion, tiempo_comida, tiempo_receta, porciones, imagen, usuarios_correo) VALUES ("' +
            rName +
            '", "' +
            rDuration +
            '", "' +
            rTime +
            '", "' +
            rType +
            '", "' +
            rPortion +
            '", "' +
            rimg +
            '", "' +
            correo +
            '")',
    })
        .then((response) => console.log("Se añadio la receta")) //Mostrar en la consola que se añadio
        .catch((error) => console.error(error)); //Mostrar el error si es que hubo
    setTimeout(function() {
        console.log("Después de 2 segundos");
        }, 2000);
    let idReceta = await obtenerIdReceta();
    console.log(idReceta); //Dubug
    receta.setId(idReceta);
    await sendIngredient();
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
                "Content-Type": "application/x-www-form-urlencoded",
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
                '";',
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                resolve(parseInt(data[0].idRecetas));
            })
            .catch((error) => reject(error));
    });
}

//Enviar ingredientes a la base de datos
async function sendIngredient() {
    const ingredientesReceta = receta.getIngredients();
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
            ingredientesReceta.forEach(ingrediente => {
                if (!nombres.includes(ingrediente)) {
                    //Si no existe en la base de datos el ingrediente
                    console.log("Ingrediente no existe en la BD");
                    fetch("../php/insertarDB.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        body:
                            'sql=INSERT INTO ingredientes (nombre) VALUES ("' + //Lo insertamos en la base de datos
                            ingrediente +
                            '")',
                    })
                        .then((response) => console.log(response))
                        .catch((error) => console.error(error));
                }
            });
        })
        .catch((error) => console.error(error));
}

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
    await leerDatosReceta();
}

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
let addButton = document.getElementById("guardarreceta"); //Variable global para el boton receta agregar
const receta = new Receta(); //Variable global para la instancia de la clase Receta
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
    //Comprobamos si estan completos
    if (
        rName == "" ||
        rDuration == "" ||
        rPortion == "" ||
        rTime == "" ||
        rType == "" ||
        rImg.files.length === 0
    ) {
        //No estan completos
        alert("Por favor, complete todos los campos y seleccione una imagen.");
        return;
    }
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
        //Si el texto coincide con la sintaxis de referencia, entonces no hay imagen
        console.log("No imagen"); //Debugg
        const partes = filaproce.match(regex); //Comparar las cadenas para saber las partes y separarlas
        const numeroPaso = partes[1]; //Aqui se guarda el numero de paso
        const descripcion = partes[2]; //Aqui se guarda la descripcion del paso
    }
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

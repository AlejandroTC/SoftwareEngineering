fetch("../php/ingredientes.php") //Pedimos en la base de datos los ingredientes existentes
    .then((response) => response.json())
    .then((data) => {
        let ingre = data; //Guardamos los resultados de php
        let nombres = ingre.map((obj) => obj.nombre); //Sacamos el nombre de los resultados
        $("#autocomplete-custom-append").autocomplete({ lookup: nombres }); //Autocompletamos el campo
    })
    .catch((error) => console.error(error));
//Codigo para agregar a la tabla

const ingres = {}; //Arreglo de ingredientes
let Addingre = document.getElementById("agregarin"); //Definimos el boton
Addingre.onclick = async function () {
    //Al hacer click en el boton de agregar ingrediente
    let NIName = document.getElementById("autocomplete-custom-append").value;
    //Chequeamos que no haya ingrtedientes duplicados
    const ing = `${NIName}`; //Creamos una variable para guardar el nombre
    if (ingres[ing]) {
        //Si el ingrediente existe en el arreglo de nombres de ingerdientes agregados en la receta
        alert("El ingrediente ya existe"); //Error
        return; //No continua y no agrega nada
    }
    //Continuamos con el codigo normal
    let NIQuantity = document.getElementById("cantidad").value; //Guardamos la cantidad
    //Chequeamos que la cantidad sea un numero y no una palabra, texto, etc
    if (isNaN(NIQuantity)) {
        //Si la cantidad no es convertible a un numero, isNaN convierte a numeros y devuelve true o false si lo ha logrado
        alert("Ingrese un número como cantidad"); //Alerta de que no es un numero
        return; //No continua y no agrega nada
    } else {
        //Continuamos con el codigo normal
        let NIUnit = document.getElementById("unidad_medida").value; //Guardamos las unidades
        if (!NIName || !NIQuantity || !NIUnit) {
            //Chequeamos que no hay nada sin llenar
            // Al menos una de las variables es vacía o nula
            alert("Por favor, complete todos los campos");
        } else {
            ingres[ing] = true; // Agregar el ingrediente al arreglo de ingredientes en la receta
            //agregar valores a la tabla de listado de ingredientes con el icono para eliminar
            let ulingredient = NIQuantity + " " + NIUnit + " de " + NIName; //Encadenamos para formar el texto a plasmar
            const tr = document.createElement("tr"); //Creamos el TR
            const tdRemove = document.createElement("td"); //Creamos el TD
            tdRemove.className = "col-md-1 col-sm-1"; //Damos clase al TD
            const icon = document.createElement("i"); //Creamos el i
            icon.classList.add("fa", "fa-times-circle-o"); //Damos clase al i
            icon.style.color = "rgb(255, 0, 89)"; //Asignamos color al i
            icon.style.textAlign = "right"; //Asignamos posicion al i
            icon.style.cursor = "pointer"; //Asignamos el pointer al cursor, como si estuviera en un boton
            icon.onclick = eliminarFila; //Asignamos evento o funcion al clickar
            const tdtext = document.createElement("td"); //Creamos el TD de texto
            tdtext.className = "col-md-11 col-sm-11"; //Damos clase al TD de texto
            let txt = document.createTextNode(ulingredient); //Inicializamos un nodo con el texto a plasmar
            tdtext.appendChild(txt); //Agregamos el textro al TD
            tdRemove.appendChild(icon); //Agregamos el icono al TD
            tr.appendChild(tdRemove); //Agregamos el TD al TR
            tr.appendChild(tdtext); //Agregamos el TD al TR
            const tbody = document
                .getElementById("listaingredientes")
                .querySelector("tbody")
                .appendChild(tr); //Agragamos al TBody ambos TR
            limpiaringre();
        }
    }
};
//Para eliminar
//Para eliminar
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

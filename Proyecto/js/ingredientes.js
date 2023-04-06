fetch("../php/ingredientes.php")
    .then((response) => response.json())
    .then((data) => {
        let ingre = data;
        let nombres = ingre.map((obj) => obj.nombre);
        $("#autocomplete-custom-append").autocomplete({ lookup: nombres });
    })
    .catch((error) => console.error(error));

let Addingre = document.getElementById("agregarin");
Addingre.onclick = function () {
    
    let NIName = document.getElementById("autocomplete-custom-append").value;
    let NIQuantity = document.getElementById("cantidad").value;
    let NIUnit = document.getElementById("unidad_medida").value;
    if (!NIName || !NIQuantity || !NIUnit) {
        // Al menos una de las variables es vacía o nula
        alert("Por favor, complete todos los campos");
    } else {
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
};
//Para eliminar
function eliminarFila() {
    const tr = this.closest("tr");
    tr.remove();
}
function limpiaringre() {
    document.getElementById("autocomplete-custom-append").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("unidad_medida").value = "";
}

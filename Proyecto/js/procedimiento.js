let ADDpro = document.getElementById("agregarpro");
const pasos = {}; //Mapa de pasos para llevar control de los existentes
ADDpro.onclick = async function () {
    let NStep = document.getElementById("nopaso").value;
    //Comprobamos que el paso no exista ya
    const paso = `${NStep}.`; //Creamos un arreglo con el paso
    if (pasos[paso]) {
        //comprobamos si el paso esta en el mapa de pasos
        alert("El paso ya existe");
        return;
    }
    pasos[paso] = true; // Agregar el paso al mapa
    //Comprobar que se haya ingresado un numero en la cantidad y no texto
    if (isNaN(NStep)) {
        alert("Ingrese un número como cantidad");
        return;
    }
    //Continuamos creando la tabla
    let Step = document.getElementById("paso").value;
    let Stepimg = document.getElementById("imgpaso");
    if (NStep.trim() === "" || Step.trim() === "") {
        // Al menos una de las variables es vacía o nula
        alert("Por favor, complete todos los campos");
    } else if (Stepimg.files.length === 0) {
        //agregar valores a la tabla de listado de ingredientes con el icono para eliminar
        let inicio = "Paso ";
        let explicacion = inicio + NStep + ". " + Step + "."; //Encadenamos para formar el texto a plasmar
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
        let txt = document.createTextNode(explicacion); //Inicializamos un nodo con el texto a plasmar
        tdtext.appendChild(txt); //Agregamos el textro al TD
        tdRemove.appendChild(icon); //Agregamos el icono al TD
        tr.appendChild(tdRemove); //Agregamos el TD al TR
        tr.appendChild(tdtext); //Agregamos el TD al TR

        const tbody = document
            .getElementById("procedimiento")
            .querySelector("tbody")
            .appendChild(tr); //Agragamos al TBody ambos TR
        limpiar();
    } else {
        let nameimg = Stepimg.files[0];
        let namestepimg = nameimg.name;

        // Convertir la imagen en un objeto Blob
        let blob = new Blob([nameimg], { type: nameimg.type });

        // agregar valores a la tabla de listado de ingredientes con el icono para eliminar
        let inicio = "Paso ";
        let explicacion = inicio + NStep + ". " + Step + ". " + namestepimg; //Encadenamos para formar el texto a plasmar
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
        let txt = document.createTextNode(explicacion); //Inicializamos un nodo con el texto a plasmar
        tdtext.appendChild(txt); //Agregamos el textro al TD
        tdRemove.appendChild(icon); //Agregamos el icono al TD

        // Agregar el objeto Blob a la tabla
        const tdBlob = document.createElement("td");
        tdBlob.style.display = "none";
        tdBlob.appendChild(blob);

        tr.appendChild(tdRemove); //Agregamos el TD al TR
        tr.appendChild(tdtext); //Agregamos el TD al TR
        tr.appendChild(tdBlob); // Agregamos el objeto Blob al TR

        const tbody = document
            .getElementById("procedimiento")
            .querySelector("tbody")
            .appendChild(tr); //Agragamos al TBody ambos TR
        limpiar();
    }
};
//Para eliminar
function eliminarFila() {
    const tr = this.closest("tr");
    tr.remove();
}
function limpiar() {
    document.getElementById("nopaso").value = "";
    document.getElementById("paso").value = "";
    document.getElementById("imgpaso").value = null;
}

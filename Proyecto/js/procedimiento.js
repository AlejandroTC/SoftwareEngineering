export const pasosBlob = []; //Arreglo de objetos Blob
let ADDpro = document.getElementById("agregarpro");
const pasos = {}; //Mapa de pasos para llevar control de los existentes
ADDpro.onclick = async function () {
    let NStep = document.getElementById("nopaso").value;
    //Comprobamos que el paso no exista ya
    const paso = `${NStep}`; //Creamos un arreglo con el paso
    if (pasos[paso]) {
        //comprobamos si el paso esta en el mapa de pasos
        alert("El paso ya existe");
        return;
    }
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
        pasos[paso] = true; // Agregar el paso al mapa
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
        pasos[paso] = true; // Agregar el paso al mapa
        let nameimg = Stepimg.files[0];
        let namestepimg = nameimg.name;

        // Convertir la imagen en un objeto Blob
        let blobimg = new Blob([nameimg], { type: nameimg.type });
        // Guardar la cadena base64 en un array
        let blobConDescripcion = {
            numero: NStep,
            blob: blobimg
        };
        pasosBlob.push(blobConDescripcion); // Agregar el objeto Blob con descripción al arreglo

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

        tr.appendChild(tdRemove); //Agregamos el TD al TR
        tr.appendChild(tdtext); //Agregamos el TD al TR

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
    const tdtext = tr.querySelector("td:nth-child(2)");
    const explicacionEliminar = tdtext.textContent.trim();
    const numeroPasoEliminar = Number(explicacionEliminar.match(/^Paso (\d+)/)[1]);
    delete pasos[numeroPasoEliminar];
    for (let i = 0; i < pasosBlob.length; i++) {
        if (parseInt(pasosBlob[i].numero) === parseInt(numeroPasoEliminar)) {
          pasosBlob.splice(i, 1); // Eliminar el objeto en la posición i
          break; // Salir del bucle una vez que se elimine el objeto
        }
      }
      
    tr.remove();
}
//Limpiar el formulario
function limpiar() {
    document.getElementById("nopaso").value = "";
    document.getElementById("paso").value = "";
    document.getElementById("imgpaso").value = null;
}

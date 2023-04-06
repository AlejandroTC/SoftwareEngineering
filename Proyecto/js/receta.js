import { Receta } from "./recetaclass.js"; //Clase receta para guardar datos
let ADDbutton = document.getElementById("guardarreceta"); //Variable global para el boton receta agregar
let receta; //Variable global para la instancia de la clase Receta

//Leemos cuando den clic en el boton de agregar receta
ADDbutton.onclick = function () {
    Leerdatosreceta();
    Imprimirdatosreceta();
};

function Leerdatosreceta() {
    const RName = document.getElementById("nombrereceta").value;
    const RDuration = document.getElementById("rduracion").value;
    const RPortion = document.getElementById("rporcion").value;
    const RTime = document.getElementById("rtiempo").value;
    const RType = document.getElementById("rtipo").value;
    const RImg = document.getElementById("rimg");
    if (
        RName == "" ||
        RDuration == "" ||
        RPortion == "" ||
        RTime == "" ||
        RType == "" ||
        RImg.files.length === 0
    ) {
        alert("Por favor, complete todos los campos y seleccione una imagen.");
    }
    receta = new Receta(RName, RDuration, RPortion, RTime, RType, RImg);
}

function Imprimirdatosreceta() {
    console.log(receta.Devolvernombrereceta());
}

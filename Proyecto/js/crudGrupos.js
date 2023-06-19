var btnAgregar = document.getElementById("agregar");

    if (btnAgregar.innerText === "Crear") {
        btnAgregar.setAttribute("onclick", "actionCreate()");
    }
    else{
        btnAgregar.innerText = "Actualizar";
        btnAgregar.setAttribute("id", "actualizar");
        btnAgregar.setAttribute("onclick", "doUpdate()");
    }
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

async function crearGrupo(nombre, codigo, descripcion, blob) {
    // Crear el objeto FormData y agregar los campos
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("clave", codigo);
    formData.append("descripcion", descripcion);
    formData.append("imagen", blob, "imagen.jpg");
    const email = await obtenerCorreo();
    formData.append("correo", email);

    fetch("../php/createGrupo.php", {
        method: "POST",
        body: formData
    })
        .then(async (response) => {
            console.log("Se añadió el grupo"); // Mostrar en la consola que se añadió
            await final("crear");
            // Realizar las acciones adicionales después de añadir el grupo
        })
        .catch((error) => {
            console.error(error); // Mostrar el error si hubo
        });
}

//----------------UPDATE-----------------
let grupoNombre;
let grupoId;
let grupoCodigo;
let grupoDescripcion;
let grupoPlaneacion;

async function actionUpdate(id) {
    var btnAgregar = document.getElementById("agregar");
    if (btnAgregar.innerText === "Crear") {
        btnAgregar.innerText = "Actualizar";
        btnAgregar.setAttribute("onclick", "doUpdate(" + id + ")");
    }
    
    const email = await obtenerCorreo();
    await obtenerGrupoUpdate(id);
    // Ingresar los datos del grupo en los elementos del formulario
    nombreInput.value = grupoNombre;
    descripcionInput.value = grupoDescripcion;
    codigoElemento.textContent = grupoCodigo;
    codigoElementoPreview.textContent = codigoElemento.textContent;
    correoPreview.textContent = email;
    profileImage.src = "data:image/png;base64," + (await obtenerImg(id));
    profileImageVisitor.src = "data:image/png;base64," + (await obtenerImg(id));
    
}
async function doUpdate(id){
    let nombre = document.getElementById("nombreGrupo").value;
    let descripcion = document.getElementById("descripcion").value;
    let codigo = document.getElementById("codigo").textContent;
    // Recuperamos los datos del formulario
    // const gImg = document.getElementById("gimg");
    // const selectedFile = gImg.files[0];
    // Recuperamos los datos del formulario
    const gImg = document.getElementById("gimg");
    const selectedFile = gImg.files[0];
    if (selectedFile) {
        // Se ha seleccionado un archivo
        const reader = new FileReader();
        reader.onload = () => {
            const blob = new Blob([reader.result], { type: gImg.type });
            // Llamar a la función para enviar los datos a la base de datos
            updateImg(id,blob);
            updateGrupo(id, nombre, codigo, descripcion);
        };
        reader.readAsArrayBuffer(selectedFile);
        console.log("Archivo seleccionado:", selectedFile.name);
      } else {
        // No se ha seleccionado ningún archivo
        updateGrupo(id, nombre, codigo, descripcion);
        console.log("No se ha seleccionado ningún archivo.");
      }
}

async function obtenerImg(id) {
    try {
        const response = await fetch("../php/misRecetas.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: 'sql=SELECT imagen FROM grupo WHERE idgrupo="' + id + '";'
        });
        const data = await response.json();
        if (data.length > 0) {
            // console.log(data);
            return data;
        }
    } catch (error) {
        console.log(error);
    }
}

async function obtenerGrupoUpdate(id) {
    try {
        const response = await fetch("../php/insertarDB.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: 'sql=SELECT idgrupo, nombre, clave, descripcion, planeacion_idplaneacion FROM grupo WHERE idgrupo="' +
                id +
                '";'
        });
        const data = await response.json();
        
        if (data.length > 0) {
            grupoNombre = data[0].nombre;
            grupoId = data[0].idgrupo;
            grupoCodigo = data[0].clave;
            grupoDescripcion = data[0].descripcion;
            grupoPlaneacion = data[0].planeacion_idplaneacion;
            
            console.log(grupoNombre);
            console.log(grupoId);
            console.log(grupoCodigo);
            console.log(grupoDescripcion);
            console.log(grupoPlaneacion);
        } else {
            console.log("No se encontró ningún grupo con el ID especificado");
        }
    } catch (error) {
        console.log(error);
    }
}

async function updateGrupo(id, Nombre, Codigo, Descripcion){
    // Crear el objeto FormData y agregar los campos
    const formData = new FormData();
    formData.append("id", id);
    formData.append("nombre", Nombre);
    formData.append("clave", Codigo);
    formData.append("descripcion", Descripcion);
    const email = await obtenerCorreo();
    formData.append("correo", email);
    fetch("../php/updateGrupo.php", {
        method: "POST",
        body: formData
    })
        .then(async (response) => {
            console.log("Se actualizo el grupo"); // Mostrar en la consola que se añadió
            await final("actualizar");
            // Realizar las acciones adicionales después de añadir el grupo
        })
        .catch((error) => {
            console.error(error); // Mostrar el error si hubo
        });
}

async function updateImg(id, blob){
    const formData = new FormData();
    formData.append("id", id);
    formData.append("imagen", blob, "imagen.jpg");

    fetch("../php/updateGrupoImg.php", {
        method: "POST",
        body: formData
    })
        .then(async (response) => {
            console.log("Se actualizo la img del grupo"); // Mostrar en la consola que se añadió
            await final("crear");
            // Realizar las acciones adicionales después de añadir el grupo
        })
        .catch((error) => {
            console.error(error); // Mostrar el error si hubo
        });
}

//---------------Funciones Varias-----------

//Cerar el formulario
function Cerrar() {
    limpiarpagina();
}

//Limpiar las variables del formulario
function limpiarpagina() {
    btnAgregar.innerText = "Crear";
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

async function final(accion) {
    if (accion == "actualizar"){
        alert("Se actualizo el grupo");
    }
    else{
        alert("Se guardó el grupo");
    }
    window.location.href = "./misGrupos.html";
}

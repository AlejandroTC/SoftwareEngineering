import { Receta } from "./recetaclass.js";
const recetas = []; //Para guardar las recetas
const email = await obtenerCorreo();
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

fetch("../php/insertarDB.php", {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    body:
        'sql=SELECT idRecetas, nombre FROM recetas WHERE Usuarios_correo="' +
        email +
        '";'
})
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        data.forEach((obj) => {
            const receta = new Receta();
            receta.setName(obj.nombre);
            receta.setId(obj.idRecetas);
            receta.setEmail(email);
            // Agregar la instancia de Receta al array de recetas
            recetas.push(receta);
        });
        console.log(recetas); //Debug
        imprimirRecetas();
    })
    .catch((error) => console.log(error));

//Leemos el correo de la sesion
async function obtenerCorreo() {
    const response = await fetch("../php/session.php");
    const data = await response.json();
    const user = data.correo;
    return user;
}

//Imprimimos las recetas en el html
async function imprimirRecetas() {
    const contenedorRecetas = document.getElementById("contenedor-recetas");
    for (const receta of recetas) {
        //Obtener el blob de la receta
        receta.setImage(await obtenerImg(receta.getId()));

        const divCol = document.createElement("div");
        divCol.classList.add("col-md-4", "col-sm-4");

        const divThumbnail = document.createElement("div");
        divThumbnail.classList.add("thumbnail");

        const divImage = document.createElement("div");
        divImage.classList.add("image", "view", "view-first");

        const img = document.createElement("img");
        img.style.width = "100%";
        img.style.display = "block";
        img.src = "data:image/png;base64," + (await obtenerImg(receta.getId()));
        img.alt = "imagen de la receta";

        const divMask = document.createElement("div");
        divMask.classList.add("mask", "no-caption");

        const divTools = document.createElement("div");
        divTools.classList.add("tools", "tools-bottom");

        const aVerReceta = document.createElement("a");
        aVerReceta.id = receta.getId();
        aVerReceta.href = "#";
        const iVerReceta = document.createElement("i");
        iVerReceta.classList.add("fa", "fa-eye");
        aVerReceta.appendChild(iVerReceta);
        divTools.appendChild(aVerReceta);

        aVerReceta.addEventListener("click", function() {
            const idReceta = this.id;
            const form = document.createElement("form");
            form.method = "POST";
            form.action = "readReceta.php";
            const inputId = document.createElement("input");
            inputId.type = "hidden";
            inputId.name = "idReceta";
            inputId.value = idReceta;
            
            form.appendChild(inputId);
            
            document.body.appendChild(form);
            form.submit();
          });

        const aEditarReceta = document.createElement("a");
        aEditarReceta.id = receta.getId();
        aEditarReceta.href = "#";
        const iEditarReceta = document.createElement("i");
        iEditarReceta.classList.add("fa", "fa-pencil");
        aEditarReceta.appendChild(iEditarReceta);
        divTools.appendChild(aEditarReceta);

        aEditarReceta.addEventListener("click", function () {
            // Obtener el ID de la receta del atributo "id" del elemento clickeado
            const idReceta = this.id;
            // Crear un formulario con un campo oculto que contenga el ID de la receta
            const form = document.createElement("form");
            form.method = "POST";
            form.action = "updateReceta.php";
            const inputIdReceta = document.createElement("input");
            inputIdReceta.type = "hidden";
            inputIdReceta.name = "idReceta";
            inputIdReceta.value = idReceta;
            form.appendChild(inputIdReceta);

            // Agregar el formulario a la página y enviarlo
            document.body.appendChild(form);
            form.submit();
        });

        divMask.appendChild(divTools);
        divImage.appendChild(img);
        divImage.appendChild(divMask);
        divThumbnail.appendChild(divImage);

        const divCaption = document.createElement("div");
        divCaption.classList.add("caption");

        const pTitulo = document.createElement("p");
        const strongTitulo = document.createElement("strong");
        strongTitulo.textContent = receta.getName();
        pTitulo.appendChild(strongTitulo);
        divCaption.appendChild(pTitulo);

        const divEstrellas = document.createElement("div");
        divEstrellas.align = "center";
        for (let i = 0; i < receta.estrellas; i++) {
            const aEstrella = document.createElement("a");
            aEstrella.href = "#";
            const spanEstrella = document.createElement("span");
            spanEstrella.classList.add("glyphicon", "glyphicon-star");
            spanEstrella.setAttribute("aria-hidden", "true");
            aEstrella.appendChild(spanEstrella);
            divEstrellas.appendChild(aEstrella);
        }
        for (let i = receta.estrellas; i < 5; i++) {
            const aEstrella = document.createElement("a");
            aEstrella.href = "#";
            const spanEstrella = document.createElement("span");
            spanEstrella.classList.add("glyphicon", "glyphicon-star-empty");
            spanEstrella.setAttribute("aria-hidden", "true");
            aEstrella.appendChild(spanEstrella);
            divEstrellas.appendChild(aEstrella);
        }
        divCaption.appendChild(divEstrellas);

        const pDescripcion = document.createElement("p");
        pDescripcion.textContent = receta.descripcion;
        divCaption.appendChild(pDescripcion);

        divThumbnail.appendChild(divCaption);
        divCol.appendChild(divThumbnail);
        contenedorRecetas.appendChild(divCol);
    }
}
async function obtenerImg(id) {
    try {
        const response = await fetch("../php/misRecetas.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:
                'sql=SELECT imagen FROM recetas WHERE idRecetas="' +
                id +
                '" AND Usuarios_correo="' +
                email +
                '";'
        });
        const data = await response.json();
        if (data.length > 0) {
            console.log(data);
            return data;
        }
    } catch (error) {
        console.log(error);
    }
}

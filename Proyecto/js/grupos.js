const idList = []; //Lista para guardar id de los grupos
const nombres = []; //Lista para guardar los nombres de los grupos
const email = await obtenerCorreo();
//Obtenemos los id de los grupos en base al correo, los console son para debug
fetch("../php/insertarDB.php", {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    body:
        'sql=SELECT id_grupo FROM usuario_has_grupo WHERE correo_usuario="' +
        email +
        '";'
})
    .then((response) => response.json())
    .then((data) => {
        // console.log(data);
        data.forEach((obj) => {
            //Los datos llegan en data = [obj[id_grupo], obj[id_grupo]], asi que por cada objeto en data se hace
            // console.log(obj);
            // console.log(obj.id_grupo);
            idList.push(obj.id_grupo); //Guardar el id del grupo en la lista
        });
        obtenerNombreGrupo(); // Una vez terminado todo vamos a obtener el nombre
    })
    .catch((error) => console.log(error));

//Leemos el correo de la sesion
async function obtenerCorreo() {
    const response = await fetch("../php/session.php");
    const data = await response.json();
    const user = data.correo;
    return user;
}

//Con el id del grupo se obtiene el nombre del mismo
async function obtenerNombreGrupo() {
    idList.forEach((id_grupo) => {
        fetch("../php/insertarDB.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:
                'sql=SELECT nombre FROM grupo WHERE idgrupo="' + id_grupo + '";'
        })
            .then((response) => response.json())
            .then((data) => {
                //nuevamente los nombres vienen en data=[obj{nombre}, obj{nombne}]
                // console.log(data);
                data.forEach((obj) => {
                    nombres.push(obj.nombre); //Guardamos el nombre en la lista
                    // console.log(obj.nombre);
                    rellenar();
                });
            })
            .catch((error) => console.log(error));
    });
}
//Generar los elementos en el html
async function rellenar() {
    const gruposElement = document.querySelector(".child_menu"); // Obtener el elemento <ul> con la clase "child_menu"
    const liElement = document.createElement("li"); // Crear un elemento <li>
    const aElement = document.createElement("a"); // Crear un elemento <a>
    //Este es para el primer elemento que siempre va a ser "Todos mis grupos"
    aElement.href = "../html/misGrupos.html"; // Establecer el atributo href del elemento <a>
    aElement.textContent = "Todos mis grupos"; // Establecer el texto del elemento <a>
    liElement.appendChild(aElement); // Agregar el elemento <a> como hijo del elemento <li>
    gruposElement.appendChild(liElement); // Agregar el elemento <li> como hijo del elemento <ul>
    //Ahora si por cada nombre en la lista de nombres, pues vamos generando los elementos
    nombres.forEach((nombre) => {
        const liElement = document.createElement("li"); // Crear un elemento <li>
        const aElement = document.createElement("a"); // Crear un elemento <a>
        aElement.href = "#"; // Establecer el atributo href del elemento <a>
        aElement.textContent = nombre; // Establecer el texto del elemento <a>
        liElement.appendChild(aElement); // Agregar el elemento <a> como hijo del elemento <li>
        gruposElement.appendChild(liElement); // Agregar el elemento <li> como hijo del elemento <ul>
    });
}

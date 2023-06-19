import { Grupo } from "./grupoclass.js";
const idList = []; //Lista para guardar id de los grupos
const Grupos = []; //Lista para guardar los datos de los grupos

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
        obtenerGrupo(); // Una vez terminado todo vamos a obtener el nombre
    })
    .catch((error) => console.log(error));

//Leemos el correo de la sesion
async function obtenerCorreo() {
    const response = await fetch("../php/session.php");
    const data = await response.json();
    const user = data.correo;
    return user;
}
//Se obtienen todos los datos del grupo
async function obtenerGrupo() {
    try {
        for (const id_grupo of idList) {
            const response = await fetch("../php/insertarDB.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: 'sql=SELECT idgrupo, nombre, clave, descripcion, planeacion_idplaneacion FROM grupo WHERE idgrupo="' +
                    id_grupo +
                    '";'
            });
            const data = await response.json();
            data.forEach((obj) => {
                const grupo = new Grupo();
                grupo.setName(obj.nombre);
                grupo.setId(obj.idgrupo);
                grupo.setCode(obj.clave);
                grupo.setDescription(obj.descripcion);
                grupo.setPlaneation(obj.pleaneacion_idpleaneacion);
                Grupos.push(grupo);
            });
        }
        console.log(Grupos);
        await llenarGrupos();
    } catch (error) {
        console.log(error);
    }
}

// Para generar las tarjetas
async function llenarGrupos() {
    console.log(Grupos);
    const contenedorGrupos = document.getElementById("contenedor-grupos");
    for (const grupo of Grupos) {
        grupo.setImage(await obtenerImg(grupo.getId()));
        grupo.setType(await obtenerTipo(grupo.getId()))
        // Crear elementos HTML
        const divFormGroup = document.createElement("div");
        divFormGroup.className = "form-group row";
        divFormGroup.id = "contenedor-grupos";

        const divCol = document.createElement("div");
        divCol.className = "col-md-3 widget widget_tally_box";

        const divXPanel = document.createElement("div");
        divXPanel.className = "x_panel fixed_height_390";

        const divXContent = document.createElement("div");
        divXContent.className = "x_content";

        const divFlex = document.createElement("div");
        divFlex.className = "flex";

        const ulWidgetProfileBox = document.createElement("ul");
        ulWidgetProfileBox.className = "flex list-inline widget_profile_box";

        const liEye = document.createElement("li");
        liEye.style.marginLeft = "6px";
        const aEye = document.createElement("a");
        aEye.href = "#";
        aEye.innerHTML = '<i class="fa fa-eye"></i>';
        aEye.setAttribute("data-toggle", "modal");
        aEye.setAttribute("data-target", "#modal_ingredientes");
        aEye.setAttribute("align", "right");
        aEye.setAttribute("onclick", "actionRead()");
        liEye.appendChild(aEye);

        const liImg = document.createElement("li");
        const imgProfile = document.createElement("img");
        imgProfile.src = "data:image/png;base64," + (await obtenerImg(grupo.getId()));
        imgProfile.alt = "imagen de la receta";
        imgProfile.className = "img-circle profile_img";
        liImg.appendChild(imgProfile);
        if (grupo.getType() == "admin") {
            const liPencil = document.createElement("li");
            const aPencil = document.createElement("a");
            aPencil.href = "#";
            aPencil.innerHTML = '<i class="fa fa-pencil"></i>';
            liPencil.appendChild(aPencil);
            ulWidgetProfileBox.appendChild(liEye);
            ulWidgetProfileBox.appendChild(liImg);
            // ulWidgetProfileBox.appendChild(liShare);
            ulWidgetProfileBox.appendChild(liPencil);
            divFlex.appendChild(ulWidgetProfileBox);
        } else {
            const liShare = document.createElement("li");
            const aShare = document.createElement("a");
            aShare.href = "#";
            aShare.innerHTML = '<i class="fa fa-share-alt"></i>';
            liShare.appendChild(aShare);
            ulWidgetProfileBox.appendChild(liEye);
            ulWidgetProfileBox.appendChild(liImg);
            ulWidgetProfileBox.appendChild(liShare);
            divFlex.appendChild(ulWidgetProfileBox);
        }

        const h3Name = document.createElement("h3");
        h3Name.className = "name";
        h3Name.textContent = grupo.getName();

        const spanEmail = document.createElement("span");
        spanEmail.style.display = "flex";
        spanEmail.style.justifyContent = "center";
        spanEmail.style.marginTop = "-20px";
        // console.log(await obtenerAdmin(grupo.getId()));
        spanEmail.textContent = await obtenerAdmin(grupo.getId());

        const divFlex2 = document.createElement("div");
        divFlex2.className = "flex";

        const ulCount2 = document.createElement("ul");
        ulCount2.className = "list-inline count2";
        ulCount2.style.display = "flex";
        ulCount2.style.justifyContent = "center";

        const liIntegrantes = document.createElement("li");
        const h3Integrantes = document.createElement("h3");
        h3Integrantes.textContent = await obtenerIntegrantes(grupo.getId());
        const spanIntegrantes = document.createElement("span");
        spanIntegrantes.textContent = "Integrantes";

        liIntegrantes.appendChild(h3Integrantes);
        liIntegrantes.appendChild(spanIntegrantes);
        ulCount2.appendChild(liIntegrantes);
        divFlex2.appendChild(ulCount2);

        // Construir la estructura HTML según los diferentes casos
        // console.log(grupo.getType())
        if (grupo.getType() === "admin") {
            const h3Codigo = document.createElement("h3");
            h3Codigo.className = "name";
            h3Codigo.textContent = grupo.getCode();
            const pCodigo = document.createElement("p");
            pCodigo.textContent = "Codigo";
            pCodigo.style.marginTop = "-10%";
            divXContent.appendChild(divFlex);
            divXContent.appendChild(h3Name);
            divXContent.appendChild(spanEmail);
            divXContent.appendChild(divFlex2);
            divXContent.appendChild(h3Codigo);
            divXContent.appendChild(pCodigo);
            
        } else {
            const pDescripcion = document.createElement("p");
            pDescripcion.textContent = grupo.getDescription();
            const h3Codigo = document.createElement("h3");
            h3Codigo.className = "name";
            h3Codigo.id = "codigoPreview";
            h3Codigo.textContent = "1234";

            const pCodigo = document.createElement("p");
            pCodigo.style.marginTop = "-10%";
            pCodigo.textContent = "Codigo";

            divXContent.appendChild(divFlex);
            divXContent.appendChild(h3Name);
            divXContent.appendChild(spanEmail);
            divXContent.appendChild(divFlex2);
            divXContent.appendChild(h3Codigo);
            divXContent.appendChild(pCodigo);
            divXContent.appendChild(pDescripcion);
        }

        divXPanel.appendChild(divXContent);
        divCol.appendChild(divXPanel);
        divFormGroup.appendChild(divCol);

        // Agregar la tarjeta al contenedor
        contenedorGrupos.appendChild(divFormGroup);
    }
}

//Con el id del grupo se obtiene la cantidad de usuarios que estan en el
async function obtenerIntegrantes(id) {
    try {
        const response = await fetch("../php/insertarDB.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: 'sql=SELECT COUNT(*) AS total_usuarios FROM usuario_has_grupo WHERE id_grupo="' +
                id +
                '";'
        });
        const data = await response.json();
        const totalUsuarios = data[0].total_usuarios;
        console.log("Grupo " + id + ": " + totalUsuarios + " usuarios");
        return totalUsuarios;
    } catch (error) {
        console.log(error);
        return 0; // Maneja el error devolviendo un valor predeterminado
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

//Con el id del grupo se obtiene la cantidad de usuarios que estan en el
async function obtenerTipo(id) {
    try {
        const response = await fetch("../php/insertarDB.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:
                'sql=SELECT rol FROM usuario_has_grupo WHERE correo_usuario="' +
                email +
                '" AND id_grupo="' +
                id +
                '";'
        });
        const data = await response.json();
        if (data.length > 0) {
            // console.log(data[0].rol);
            return data[0].rol;
        }
    } catch (error) {
        console.log(error);
    }
}

async function obtenerAdmin(id) {
    const response = await fetch("../php/insertarDB.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body:
            'sql=SELECT correo_usuario FROM usuario_has_grupo WHERE id_grupo="' +
            id + '" AND rol= "admin";'
    });
    const data = await response.json();
    if (data.length > 0) {
        // console.log(data[0].correo_usuario);
        return data[0].correo_usuario;
    }
}

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
    idList.forEach((id_grupo) => {
        fetch("../php/insertarDB.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:
                'sql=SELECT * FROM grupo WHERE idgrupo="' + id_grupo + '";'
        })
            .then((response) => response.json())
            .then((data) => {
                //nuevamente los nombres vienen en data=[obj{nombre}, obj{nombne}]
                // console.log(data);
                data.forEach((obj) => {
                    nombres.push(obj.nombre); //Guardamos el nombre en la lista
                    // console.log(obj.nombre);
                    llenarGrupos();
                });
            })
            .catch((error) => console.log(error));
    });
}
// Para generar las tarjetas
async function llenarGrupos() {
    const contenedorGrupos = document.getElementById("contenedor-grupos");
  
    nombres.forEach(async (nombre) => {
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
      const iEye = document.createElement("i");
      iEye.className = "fa fa-eye";
      aEye.appendChild(iEye);
      liEye.appendChild(aEye);
  
      const liImg = document.createElement("li");
      const imgProfile = document.createElement("img");
      imgProfile.src = "../img/1.png";
      imgProfile.alt = "...";
      imgProfile.className = "img-circle profile_img";
      liImg.appendChild(imgProfile);
  
      const liShare = document.createElement("li");
      const aShare = document.createElement("a");
      aShare.href = "#";
      const iShare = document.createElement("i");
      iShare.className = "fa fa-share-alt";
      aShare.appendChild(iShare);
      liShare.appendChild(aShare);
  
      ulWidgetProfileBox.appendChild(liEye);
      ulWidgetProfileBox.appendChild(liImg);
      ulWidgetProfileBox.appendChild(liShare);
      divFlex.appendChild(ulWidgetProfileBox);
  
      const h3Name = document.createElement("h3");
      h3Name.className = "name";
      h3Name.textContent = nombre;
  
      const spanEmail = document.createElement("span");
      spanEmail.style.display = "flex";
      spanEmail.style.justifyContent = "center";
      spanEmail.style.marginTop = "-20px";
      spanEmail.textContent = "alguien@example.com"; // Cambiar para el correo del dueño
  
      const divFlex2 = document.createElement("div");
      divFlex2.className = "flex";
  
      const ulCount2 = document.createElement("ul");
      ulCount2.className = "list-inline count2";
      ulCount2.style.display = "flex";
      ulCount2.style.justifyContent = "center";
  
      const liIntegrantes = document.createElement("li");
      const h3Integrantes = document.createElement("h3");
      h3Integrantes.textContent = await obtenerIntegrantes();
      const spanIntegrantes = document.createElement("span");
      spanIntegrantes.textContent = "Integrantes";
  
      liIntegrantes.appendChild(h3Integrantes);
      liIntegrantes.appendChild(spanIntegrantes);
      ulCount2.appendChild(liIntegrantes);
      divFlex2.appendChild(ulCount2);
  
      const pDescripcion = document.createElement("p");
      pDescripcion.textContent = "Una pequeña descripcion del grupo";
  
      // Construir la estructura HTML
      divXContent.appendChild(divFlex);
      divXContent.appendChild(h3Name);
      divXContent.appendChild(spanEmail);
      divXContent.appendChild(divFlex2);
      divXContent.appendChild(pDescripcion);
  
      divXPanel.appendChild(divXContent);
      divCol.appendChild(divXPanel);
      divFormGroup.appendChild(divCol);
  
      // Agregar la tarjeta al contenedor
      contenedorGrupos.appendChild(divFormGroup);
    });
  }
  
//Con el id del grupo se obtiene la cantidad de usuarios que estan en el
async function obtenerIntegrantes() {
    const promesas = idList.map((id_grupo) => {
      return fetch("../php/insertarDB.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body:
          'sql=SELECT COUNT(*) AS total_usuarios FROM usuario_has_grupo WHERE id_grupo="' +
          id_grupo +
          '";'
      })
        .then((response) => response.json())
        .then((data) => {
          const totalUsuarios = data[0].total_usuarios;
          console.log("Grupo " + id_grupo + ": " + totalUsuarios + " usuarios");
          return totalUsuarios;
        })
        .catch((error) => {
          console.log(error);
          return 0; // Maneja el error devolviendo un valor predeterminado
        });
    });
  
    return Promise.all(promesas);
  }
  
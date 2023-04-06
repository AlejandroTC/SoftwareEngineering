class Receta {
    constructor(nombre, duracion, porcion, tiempo, tipo, imagen, correo, recetaid=0) {
        this.name = nombre;
        this.duration = duracion;
        this.portion = porcion;
        this.time = tiempo;
        this.type = tipo;
        this.img = imagen;
        this.mail = correo;
        this.id = recetaid;
    }

    Devolvernombrereceta(){
        return this.name;
    }
    Devolveridreceta(){
        return this.id;
    }
}
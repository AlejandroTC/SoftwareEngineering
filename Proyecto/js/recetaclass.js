/*
Este documento es para guardar la receta como objeto y poder almacenar y no modificar el 
contenido de la misma a menos que sea necesario facilitando asi el uso de las 
sentencias sql ya que todo esta aqui

This document is to save the recipe as an object and be able to store it and not modify
its content unless necessary, thus facilitating the use of sql statements since everything
is here.
*/
export class Receta {
    constructor() {
        this.name = "";
        this.duration = "";
        this.portion = "";
        this.time = "";
        this.type = "";
        this.img = "";
        this.email = "";
        this.id = undefined;
    }
    
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    getDuration() {
        return this.duration;
    }
    setDuration(duration) {
        this.duration = duration;
    }
    getPortion() {
        return this.portion;
    }
    setPortion(portion) {
        this.portion = portion;
    }
    getTime() {
        return this.time;
    }
    setTime(time) {
        this.time = time;
    }
    getType() {
        return this.type;
    }
    setType(type) {
        this.type = type;
    }
    getImage() {
        return this.img;
    }
    setImage(image) {
        this.img = image;
    }
    getEmail() {
        return this.email;
    }
    setEmail(email) {
        this.email = email;
    }
    getId() {
        return this.id;
    }
    setId(recipeId) {
        this.id = recipeId;
    }
}

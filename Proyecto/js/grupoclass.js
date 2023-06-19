export class Grupo {
    constructor() {
      this.name = "";
      this.code = "";
      this.description = "";
      this.img = "";
      this.planeation = "";
      this.id = undefined;
      this.type= "";
    }
  
    getName() {
      return this.name;
    }
    setName(name) {
      this.name = name;
    }
  
    getCode() {
      return this.code;
    }
    setCode(code) {
      this.code = code;
    }
  
    getDescription() {
      return this.description;
    }
    setDescription(description) {
      this.description = description;
    }
  
    getImage() {
      return this.img;
    }
    setImage(image) {
      this.img = image;
    }
  
    getPlaneation() {
      return this.planeation;
    }
    setPlaneation(planeation) {
      this.planeation = planeation;
    }
  
    getId() {
      return this.id;
    }
    setId(id) {
      this.id = id;
    }

    getType() {
        return this.type;
    }
    setType(type) {
        this.type = type;
    }
  }
  
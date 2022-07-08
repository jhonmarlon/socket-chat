class Usuarios {

    constructor() {
        this.personas = [];
    }

    agregarPersona(id, nombre, sala) {
        //Creamos el objeto persona
        let persona = { id, nombre, sala };
        //Agregamos la persona al arreglo de personas
        this.personas.push(persona);

        return this.personas;
    }

    getPersona(id) {
        //Obtenemos una persona del array de persoans de acuerdo al id recibido
        let persona = this.personas.filter(persona => persona.id === id)[0];

        return persona;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {
        let personasPorSala = this.personas.filter(persona => persona.sala === sala);

        return personasPorSala;
    }

    borrarPersona(id) {

        let personaBorrada = this.getPersona(id);

        //Obtenemos a todas las personas que no concuerden con el id recibido y las ponemos en el array personas
        this.personas = this.personas.filter(persona => persona.id != id);

        return personaBorrada;
    }

}

module.exports = {
    Usuarios
};
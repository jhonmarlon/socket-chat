const { io } = require('../server');

const { Usuarios } = require('../clases/usuarios');
const usuarios = new Usuarios();

const { crearMensaje } = require('../utilidades/utilidades');


io.on('connection', (client) => {

    console.log('Usuario conectado');

    client.on('entrarChat', (usuario, callback) => {

        //Si no viene el nombre o el usuario como tal
        if (!usuario.nombre || !usuario.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            })
        }

        //CONECTANDO A UN USUARIO A UNA SALA
        client.join(usuario.sala);

        //Agregamos al usuario conectado al array de usuarios
        usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);

        //Cuando un usuario se conecta a una sala especifica, se le emite a todos los usuarios conectados a esa misma sala la lista de usuarios que estan en ella
        client.broadcast.to(usuario.sala).emit('listaPersonas', usuarios.getPersonasPorSala(usuario.sala));

        //Retornamos en el callback sa los usuarios que hacen parte ed la sala a la que se conecto el usaurio actual
        callback(usuarios.getPersonasPorSala(usuario.sala));
    })


    //Recibiendo mensaje desde el frontend
    client.on('crearMensaje', (data) => {

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        //Emitiendo mensaje a todos los usuarios conectados a la sala especifica a la que esta conectado el usuario actual
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    });


    //Cuando un cliente se desconecta
    client.on('disconnect', () => {

        //Borramos del array de usuarios al usuario que se acaba de desconectar
        let personaBorrada = usuarios.borrarPersona(client.id);

        //Cuando un usuario se desconecta se le emite la lista de todos los usuarios conectados a los usuarios que estan en la sala
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));
        //Se emite un mensaje a todos los usuarios que estqan en la sala de que el usuario actual ha salido
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió`));
    });

    //Mensajes privados
    client.on('mensajePrivado', data => {

        //Tomamos a la persona que esta mandando el mensaje
        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });

});
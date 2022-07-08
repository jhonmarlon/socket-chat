var socket = io();

//Obtenemos los parametros que hay en la URL
let params = new URLSearchParams(window.location.search);

//Validamos que dentro de los parámetros exista uno llamado nombre y la sala
if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

let usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

socket.on('connect', function () {
    console.log('Conectado al servidor');

    //Diciendo a backend quien se conexto
    socket.emit('entrarChat', usuario, (resp) => {
        console.log('Usuarios conectados: ', resp);
    });

});

// escuchar
socket.on('disconnect', function () {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('crearMensaje', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function (resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crearMensaje', function (mensaje) {

    console.log('Servidor:', mensaje);

});


//Escuchar cambios de usuarios
//Cuando un usuario entrao sale del chat
socket.on('listaPersonas', (personas) => {
    console.log(personas);
});

//Mensajes privados
socket.on('mensajePrivado', (mensaje) => {
    console.log('Mensaje privado: ', mensaje)
});
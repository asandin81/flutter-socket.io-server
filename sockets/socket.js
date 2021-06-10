const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('Queen'))
bands.addBand(new Band('Bon Jovi'))
bands.addBand(new Band('Iron Maiden'))
bands.addBand(new Band('Jarabe de Palo'))
console.log(bands);
//Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado' + client);

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', (payload) => {
        console.log('Mensaje', payload);

        io.emit('mensaje', { admin: 'Nuevo mensaje' });

    });

    // client.on('emitir-mensaje', (payload) => {
    //     console.log(payload);
    //     client.broadcast.emit('nuevo-mensaje', payload);
    // });

    client.on('vote-band', (payload) => {
        console.log(payload);
        bands.voteBand(payload.id);
        // io se utiliza para enviarlo a todos y no solo al cliente.
        io.emit('active-bands', bands.getBands());

    });

    client.on('add-band', (payload) => {
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (payload) => {

        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

});
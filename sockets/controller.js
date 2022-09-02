const TicketControl = require('../models/ticket-control');

const Ticket = new TicketControl();

const socketController = (socket) => {
    const lastTicketGenerated = Ticket.lastTicket;
    const lastFourTickets = Ticket.lastFourTickets
    const currentTickets = Ticket.tickets

    socket.emit('last-ticket', lastTicketGenerated);
    socket.emit('current-status', lastFourTickets);
    socket.emit('pending-tickets', currentTickets.length)

    socket.on('next-ticket', (payload, callback) => {
        const nextTicket = Ticket.nextTicket();
        callback(nextTicket);

        // TODO: Notify a new Ticket
        socket.broadcast.emit('pending-tickets', currentTickets.length)
    });


    /* Attend Ticket */
    socket.on('attend-ticket', ({ desk }, callback) => {
        
        if (!desk) {
            return callback({
                ok: false,
                msg: "Escritorio es requerido"
            })
        }

        const ticket = Ticket.attendTicket(desk)

        // Notify changes
        socket.emit('pending-tickets', currentTickets.length)
        socket.broadcast.emit('pending-tickets', currentTickets.length)
        socket.broadcast.emit('current-status', lastFourTickets);
    

        if (!ticket) {
            return callback({
                ok: false,
                msg: "Ticket no existe"
            })
        } else {
            return callback({
                ok: true,
                ticket
            })
        }


    })
};

module.exports = {
    socketController,
};

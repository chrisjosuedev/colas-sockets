const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const btnTicket = document.querySelector('#btnTicket');

/** Socket */

const socket = io();

socket.on('connect', () => {
    btnTicket.disabled = false;
});

socket.on('disconnect', () => {
    btnTicket.disabled = true;
});

socket.on('last-ticket', (lastTicket) => {
    lblNuevoTicket.innerHTML = 'Ultimo ticket: # ' + lastTicket
});

btnTicket.addEventListener('click', () => {
    /* Require a new ticket and show it and Label */
    socket.emit('next-ticket', null, (newTicket) => {
        lblNuevoTicket.innerHTML = newTicket;
    });
});

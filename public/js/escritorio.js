/** HTML References */
const lblDesk = document.querySelector('h1');
const btnAttend = document.querySelector('button');
const spanAttend = document.querySelector('small');
const divAlert = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes')

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}

const desk = searchParams.get('escritorio');


lblDesk.innerHTML = desk;

divAlert.style.display = 'none'

/** Socket */

const socket = io();

socket.on('connect', () => {
    btnAttend.disabled = false;
});

socket.on('disconnect', () => {
    btnAttend.disabled = true;
});

socket.on('pending-tickets', (pendingTickets) => {
    if (pendingTickets === 0) {
        lblPendientes.style.display = 'none'    
    } else {
        lblPendientes.style.display = ''
    }

    lblPendientes.innerHTML = pendingTickets
});

btnAttend.addEventListener('click', () => {
    socket.emit('attend-ticket', { desk }, ({ ok, ticket }) => {
        if (!ok) {
            spanAttend.innerHTML = 'No hay en espera.';
            return divAlert.style.display = '';
        } 
        spanAttend.innerHTML = ticket.number;
    });
});

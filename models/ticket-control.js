const path = require('path');
const fs = require('fs');

/* Ticket */
class Ticket {
    constructor(number, desk) {
        this.number = number;
        this.desk = desk;
    }
}

/* Control Ticket */
class TicketControl {
    constructor() {
        this.lastTicket = 0;
        this.today = new Date().getDate();
        this.tickets = [];
        this.lastFourTickets = [];

        // Init
        this.init();
    }

    // JSON db
    get toJson() {
        return {
            lastTicket: this.lastTicket,
            today: this.today,
            tickets: this.tickets,
            lastFourTickets: this.lastFourTickets,
        };
    }

    init() {
        // Read JSON file
        const {
            lastTicket,
            today,
            tickets,
            lastFourTickets,
        } = require('../db/data.json');

        /* If TODAY, variables with JSON */
        if (today === this.today) {
            this.tickets = tickets;
            this.lastTicket = lastTicket;
            this.lastFourTickets = lastFourTickets;
        } else {
            /* Its another day, save in JSON */
            this.saveDb();
        }
    }

    saveDb() {
        const pathDb = path.join(__dirname, '../db/data.json');
        fs.writeFileSync(pathDb, JSON.stringify(this.toJson));
    }

    nextTicket() {
        this.lastTicket += 1;

        const ticket = new Ticket(this.lastTicket, null);

        this.tickets.push(ticket);

        this.saveDb();

        return 'Nuevo Ticket: ' + ticket.number;
    }

    attendTicket(desk) {
        /** No tickets available */
        if (this.tickets.length === 0) {
            return null;
        }

        /** Remove First Ticket  -> FIFO */
        const ticket = this.tickets.shift();
        
        ticket.desk = desk;

        this.lastFourTickets.unshift(ticket)

        if (this.lastFourTickets.length > 4) {
            /* -1, Cut 1 only */
            this.lastFourTickets.splice(-1, 1)
        }

        this.saveDb()

        return ticket
    }
}

module.exports = TicketControl;

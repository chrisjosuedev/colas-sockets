const express = require('express');
const cors = require('cors');

const { socketController } = require('../sockets/controller')

class Server {
    constructor() {
        // Basic Config
        this.app = express();
        this.port = process.env.PORT;

        // Socket IO Config
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        // Routes
        this.paths = {};

        // Middlewares
        this.middlewares();

        // Init Routes
        this.routes();

        // Init Sockets
        this.sockets();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.static('public'));
    }

    routes() {
        // this.app.use(this.paths.users, require('../routes/users.routes'));
    }

    sockets() {
        // Server Socket
        // Check if client is connected
        this.io.on('connection', socketController)
    }

    listen() {
        // Run Socket Server
        this.server.listen(this.port, () => {
            console.log(`Listening on port http://localhost:${this.port}`);
        });
    }
}

module.exports = Server;

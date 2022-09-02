require('dotenv').config();
const Server = require('./models/server')

const runServer = new Server()

runServer.listen()
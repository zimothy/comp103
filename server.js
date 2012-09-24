var app, express, server;

express = require('express');

app    = express();
server = require('http').createServer(app);

app.use(express.static('public'));

// Handles the chatting sockets.
require('./server/chat').listen(server);

server.listen(3000);

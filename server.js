var app, express, server, session;

express = require('express');
session = require('./server/session');

app    = express();
server = require('http').createServer(app);

app.engine('.coffee', require('coffeecup').__express);
app.set('view engine', 'coffee');

session = new session.Session();

app.get('/', function (req, res) {
  res.render('game', session);
});

app.use(express.static('public'));

// Handles the chatting sockets.
require('./server/chat').listen(server, session);

server.listen(3000);

var _, sio;

_   = require('underscore');
sio = require('socket.io');

exports.listen = function(server) {
  var chatters;

  // The currently connected chatters.
  chatters = [];

  sio.listen(server).sockets.on('connection', function(socket) {
    // When a chatter connects, their socket is pushed into the chatters list.
    chatters.push(socket);

    // When the 'chat' message arrives, bounce the message to every socket that
    // is not the one sending it.
    socket.on('chat', function(data) {
      _.each(chatters, function(chatter) {
        if (chatter !== socket) {
          chatter.emit('chat', data);
        }
      });
    });

    socket.on('disconnect', function() {
      // When a chatter disconnects, they remove themselves from the list.
      chatters.splice(chatters.indexOf(socket), 1);
    });
  });
};

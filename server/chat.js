var _, sio;

_   = require('underscore');
sio = require('socket.io');

exports.listen = function(server, session) {
  var chatters;

  // The currently connected chatters.
  chatters = {};

  function eachChatter(callback) {
    _.each(_.values(chatters), callback);
  }

  sio.listen(server).sockets.on('connection', function(socket, data) {
    // When a socket connects, it first sends a login message with its username.
    socket.on('login', login);

    function login(data) {
      var user, entries;

      user    = data.user;
      entries = session.chat.slice(data.count);

      if (user.charAt(0) === "#") {
        socket.emit('failed login', "Invalid username");
        return;
      }

      if (_.has(chatters, user)) {
        socket.emit('failed login', "Username taken");
        return;
      }

      // Can't login twice.
      socket.removeListener('login', login);

      session.addLogin(user);

      eachChatter(function(chatter) {
        chatter.emit('login', user);
      });

      // Record the chatter.
      chatters[user] = socket;

      socket.on('chat', function(data) {
        var to, text;

        to   = data.to;
        text = data.text;

        // Log the chat in the session.
        session.addText(user, text);

        if (to === "#all") {
          // Bounce the chat message to all other chatters.
          eachChatter(function(chatter) {
            if (chatter !== socket) {
              chatter.emit('chat', {
                user:    user,
                text:    text,
                whisper: false
              })
            }
          });
        } else if (chatters[to]) {
          chatters[to].emit('chat', {
            user:    user,
            text:    text,
            whisper: true
          });
        }
      });

      socket.on('disconnect', function() {
        // Remove the chatter.
        delete chatters[user];

        session.addLogout(user);

        eachChatter(function(chatter) {
          chatter.emit('logout', user);
        })
      });

      // Pass back any chat messages that have happened after the page load but
      // before the login.
      socket.emit('logged in', entries);
    }
  });
};

// Represents a session of a game.
function Session() {
  this.chat = new Chat();
}

function Chat() {
  this.log = [];
}

Chat.prototype = {

  // Adds a record of a user login.
  addLogin: function(user) {
    this.log.push({
      type: 'login',
      user: user
    });
  },

  // Adds a record of a user chatting.
  addText: function(user, text) {
    this.log.push({
      type: 'text',
      user: user,
      text: text
    });
  },

  // Adds a record of a user logging out.
  addLogout: function(user) {
    this.log.push({
      type: 'logout',
      user: user
    });
  }
  
};

exports.Session = Session;

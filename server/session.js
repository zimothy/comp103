var map, _;

map = require('./map');
_ = require('underscore');

// Represents a session of a game.
function Session() {
  this.chat = [];
  this.users = [];
  this.map = map.makeMap(10, 10);
  this._ = _;
}

Session.prototype = {

  // Adds a record of a user login.
  addLogin: function(user) {
    this.users.push(user);
    this.chat.push({
      type: 'login',
      user: user
    });
  },

  // Adds a record of a user chatting.
  addText: function(user, text, to) {
    this.chat.push({
      type:    'text',
      user:    user,
      text:    text,
      whisper: to
    });
  },

  // Adds a record of a user logging out.
  addLogout: function(user) {
    this.users.splice(this.users.indexOf(user), 1);
    this.chat.push({
      type: 'logout',
      user: user
    });
  },

  // Adds a game announcement.
  addAnnouncement: function(text) {
    this.chat.push({
      type: 'accouncement',
      text: text
    });
  }
  
};

exports.Session = Session;

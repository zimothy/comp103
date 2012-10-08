var to, input, send, log, socket, username;

to    = $("#chat-to");
input = $("#chat-input");
send  = $("#chat-send");
log   = $("#chat-log");

scrollChat();

username = "tim";
if (!username) {
  return;
}

socket = io.connect('/');

socket.on('chat', function(data) {
  addEntry(data.user, data.text, data.whisper);
});

socket.on('login', function(user) {
  addLogin(user);

  to.append("<option value='" + user + "'>" + user + "</option>");
});

socket.on('logout', function(user) {
  addLogout(user);

  to.find('[value=' + user + ']').remove();
});

socket.on('announcement', addAnnouncement);

socket.on('logged in', function(entries) {
  $.each(entries, function(i, entry) {
    if (entry.type === "login") {
      addLogin(entry.user);
    } else if (entry.type === "text") {
      addEntry(entry.user, entry.text);
    } else if (entry.type === "logout") {
      addLogout(entry.user);
    }
  });

  send.click(chat);

  input.keypress(function(e) {
    if (e.which === 13) {
      chat();
    }
  });

  input.removeAttr('disabled');

  addLogin(username);
});

socket.on('failed login', function(reason) {
  reason = span('chat-reason', reason);

  addItem('chat-fail', function(item) {
    item.append("Failed to login: ").append(reason);
  });
})

socket.emit('login', {
  user: username,
  count: log.children().length
});

function addLogin(user) {
  addItem('chat-login', function(item) {
    item.append(span('chat-user', user)).append(" has logged in.");
  });
}

function addLogout(user) {
  addItem('chat-logout', function(item) {
    item.append(span('chat-user', user)).append(" has logged out.");
  });
}

function addEntry(user, text, whisper) {
  text = span('chat-text', text);

  if (whisper) {
    text.addClass('chat-whisper');
  }

  addItem('chat-entry', function(item) {
    var last;

    last = log.children().last();

    if (!last.hasClass('chat-entry') ||
        last.find('.chat-user').text() !== user) {
      item.append(span('chat-user', user)).append(": ");
    }

    item.append(text);
  });
}

function addAnnouncement(text) {
  addItem('chat-announcement', function(item) {
    item.append(span('chat-announcement', text));
  });
}

function span(className, text) {
  return $("<span></span>").addClass(className).text(text);
}

function addItem(className, callback) {
  var item;

  item = $("<li></li>").addClass(className);
  callback(item);

  log.append(item);
  scrollChat();
}

function scrollChat() {
  var height;

  height = 0;
  $.each(log.children(), function(i, child) {
    height += $(child).outerHeight();
  });
  log.scrollTop(height);
}

function chat() {
  var text, tov;

  text = input.val();
  tov  = to.val();

  if (text.replace(/\s/g, '') !== "") {
    addEntry(username, text, tov !== "#all");
    input.val("");

    socket.emit('chat', {
      to:   tov,
      text: text
    });
  }
}

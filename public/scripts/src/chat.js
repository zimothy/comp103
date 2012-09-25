var input, send, log, socket, username;

username = "Tim";

input = $("#chat-input");
send  = $("#chat-send");
log   = $("#chat-log");

socket = io.connect('/');

function addEntry(user, text) {
  var entry, userE;

  entry = $("<li></li>");
  userE = $("<span class='chat-user'></span>");

  userE.text(user);
  entry.append(userE);
  entry.append(": " + text);

  log.append(entry);
  log.scrollTop(entry.outerHeight() * log.children().length);
}

function chat() {
  var text;

  text = input.val();

  if (text.replace(/\s/g, '') !== "") {
    addEntry(username, text);
    input.val("");

    socket.emit('chat', {
      user: username,
      text: text
    });
  }
}

send.click(chat);

input.keypress(function(e) {
  if (e.which === 13) {
    chat();
  }
});

socket.on('chat', function(data) {
  addEntry(data.user, data.text);
});

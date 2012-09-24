test("Chat entry", function() {
  var entry;

  addEntry("username", "chat text");
  entry = $("#chat-log").children();
  
  strictEqual(entry.length, 1, "One entry added");
  strictEqual(entry.find(".chat-user").text(), "username", "Correct username");
  strictEqual(entry.text(), "username: chat text", "Correct entry text");
});

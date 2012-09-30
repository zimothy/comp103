var log, userClass, textClass;

log = $("#chat-log");

userClass = ".chat-user";
textClass = ".chat-text";

// Creates a random string of ASCII characters of length between 1 and 20.
function makeRandomAsciiString() {
  var length, string;

  length = Math.floor(Math.random() * 20 + 1);

  string = "";
  _.times(length, function() {
    string += String.fromCharCode(Math.floor(Math.random() * 128));
  });

  return string;
}

// Creates a test that tries 200 different random string combinations.
// Takes a parameter on whether it should test for chat text as well as user.
function makeTest(func) {
  var testText = func.length > 1;

  return function() {
    _.times(200, function() {
      var user, text, entry;

      log.children().remove();

      user = makeRandomAsciiString();
      if (testText) {
        text = makeRandomAsciiString();
      }

      func(user, text);
      entry = log.children();

      strictEqual(entry.length, 1, "One entry added");
      strictEqual(entry.find(userClass).text(), user, "Correct user: " + user);

      if (testText) {
        strictEqual(entry.find(textClass).text(), text, "Correct text:" + text);
      }
    });
  };
}

test("Chat entry", makeTest(adEntry));

test("User login", makeTest(addLogin));

test("User logout", makeTest(addLogout));

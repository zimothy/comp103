var log, userClass, textClass, announcementClass;

log = $("#chat-log");

userClass = ".chat-user";
textClass = ".chat-text";
announcementClass = ".chat-announcement";

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
function makeTest(func, firstClass, secondClass) {
  return function() {
    _.times(200, function() {
      var first, second, entry;

      log.children().remove();

      first = makeRandomAsciiString();
      if (secondClass) {
        second = makeRandomAsciiString();
      }

      func(first, second);
      entry = log.children();

      strictEqual(entry.length, 1, "One entry added");
      strictEqual(entry.find(firstClass).text(), first,
        "First class: " + first);

      if (secondClass) {
        strictEqual(entry.find(secondClass).text(), second,
          "Second class:" + second);
      }
    });
  };
}

test("Chat entry", makeTest(addEntry, userClass, textClass));

test("User login", makeTest(addLogin, userClass));

test("User logout", makeTest(addLogout, userClass));

test("Announcement", makeTest(addAnnouncement, announcementClass));

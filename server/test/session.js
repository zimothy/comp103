var Session;

Session = require('../session').Session;

exports['Test chat'] = function(test) {
    var chat, user, text;

    chat = new Session().chat;
    user = 'tim';
    text = 'chat text';

    test.strictEqual(chat.log.length, 0, "Starts with no log");

    chat.addLogin(user);

    test.strictEqual(chat.log.length, 1, "Login adds one log");
    test.strictEqual(chat.log[0].type, 'login', "Login adds login log");
    test.strictEqual(chat.log[0].user, user, "Login adds correct username");

    chat.addText(user, text);

    test.strictEqual(chat.log.length, 2, "Text adds one log");
    test.strictEqual(chat.log[1].type, 'text', "Text adds text log");
    test.strictEqual(chat.log[1].user, user, "Text add correct username");
    test.strictEqual(chat.log[1].text, text, "Text add correct text");

    chat.addLogout(user);

    test.strictEqual(chat.log.length, 3, "Logout adds one log");
    test.strictEqual(chat.log[2].type, 'logout', "Logout adds logout log");
    test.strictEqual(chat.log[2].user, user, "Logout adds correct username");

    test.done();
};

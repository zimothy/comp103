doctype 5
html ->
  head ->
    meta charset: 'utf-8'
    title "Game"
    link rel: 'stylesheet', href: '/styles/layout.css'
    script src: '/scripts/lib/jquery-1.8.2.min.js'
    script src: '/scripts/lib/underscore-1.4.2.min.js'
    script src: '/socket.io/socket.io.js'
    script src: '/scripts/lib/game.js'
  body ->
    canvas id: 'game'
    section id: 'chat', ->
      ol id: 'chat-log', ->
        for entry in @chat
          className = switch entry.type
            when 'login'
              "chat-login"
            when 'text'
              "chat-entry"
            when 'logout'
              "chat-logout"
          li class: className, ->
            span class: 'chat-user', "#{entry.user}"
            switch entry.type
              when 'login'
                text " has logged in."
              when 'text'
                text ": #{entry.text}"
              when 'logout'
                text " has logged out."
      div id: 'chat-box', ->
        select id: 'chat-to', ->
          option value: '#all', selected: 'selected', "All"
          for user in @users
            option value: user, user
        input id: 'chat-input', disabled: 'disabled'
        button id: 'chat-send', "Send"

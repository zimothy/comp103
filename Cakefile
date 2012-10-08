fs   = require 'fs'
http = require 'http'

scripts = "public/scripts"
source  = "#{scripts}/src"
outFile = "#{scripts}/lib/game.js"

fullEscape = (str) ->
  escape(str).replace /\+/g, '%2B'

combine = ->
  files = fs.readdirSync source
  files = for file in files
    content = new String fs.readFileSync "#{source}/#{file}"
    content.name = file.substring(0, file.length - 3);
    content

  out = "$(function() {\nvar modules = {};\n"
  for file in files
    out += "(function(exports) {\n#{file}})(modules.#{file.name} = {});\n"
  
  out += "_.each(_.values(modules), function(m) { "
  out += "if (typeof m.main === 'function') m.main(); });\n"

  "#{out}window.game = modules;\n});\n"

minify = (script, callback) ->
  req = http.request
    host: 'closure-compiler.appspot.com'
    path: '/compile'
    method: 'POST'
    headers:
      'Content-Type': 'application/x-www-form-urlencoded'
  , (res) ->
    res.setEncoding 'utf8'
    res.on 'data', (chunk) ->
      callback chunk

  req.on 'error', (e) ->
    console.log "Error: #{e}"

  req.write "js_code=#{fullEscape script}"
  req.write "&output_format=text"
  req.write "&output_info=compiled_code"

  req.end()

task 'build', 'build the JS source into a combined output', ->
  fs.writeFileSync outFile, combine()

task 'minify', 'build the JS source into a combined minified output', ->
  file = fs.openSync outFile, 'w'
  minify combine(), (chunk) ->
    fs.write file, chunk

task 'watch', 'perform the build action on source changes', ->
  console.log "Watching #{source} for changes"
  fs.watch source, ->
    console.log "Wrote game.js"
    fs.writeFileSync outFile, combine()  
  
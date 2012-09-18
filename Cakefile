fs   = require 'fs'
http = require 'http'

scripts = "public/scripts"
source  = "#{scripts}/src"
outFile = "#{scripts}/game.js"

fullEscape = (str) ->
  escape(str).replace /\+/g, '%2B'

combine = ->
  files = fs.readdirSync source
  files = for file in files then fs.readFileSync "#{source}/#{file}"

  out = '$(function() {\n\n'
  for file in files
    out += file

  out + '\n});\n'

minify = (script, callback) ->
  socket = fs.readFileSync "#{scripts}/socket.io.min.js"

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
  req.write "&compilation_level=ADVANCED_OPTIMIZATIONS"
  req.write "&output_format=text"
  req.write "&output_info=compiled_code"
  req.write "&externs_url=" +
            "https://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"
  req.write "&js_externs=#{fullEscape socket}"

  req.end()

task 'build', 'build the JS source into a combined output', ->
  fs.writeFileSync outFile, combine()

task 'minify', 'build the JS source into a combined minified output', ->
  file = fs.openSync outFile, 'w'
  minify combine(), (chunk) ->
    fs.write file, chunk

task 'watch', 'perform the build action on source changes', ->
  fs.watch source, ->
    fs.writeFileSync outFile, combine()  
  
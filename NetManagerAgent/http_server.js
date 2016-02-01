"use strict";
var http_server = exports;

var config = require('./config.js');
var http = require('http');
var colors = require('colors/safe');

function handleRequest(request, response) {
    if (requese.url == '/') {
        response.end("NetManager Agent - Current Status");
    }
}

var server = http.createServer(handleRequest);

server.listen(config.http_server.listeningPort, function() {
   console.log(colors.green('OK: ') + "HTTP Management Server started on port " + config.http_server.listeningPort);
});

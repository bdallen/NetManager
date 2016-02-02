"use strict";
var http_server = exports;

var config = require('./../config/config.js');
var agent_status = require('./status.js');
var http = require('http');
var colors = require('colors/safe');
var fs = require('fs');

function handleRequest(request, response) {
    if (request.url == '/') {
        fs.readFile(__dirname + '/html/index.static.html', function (err, data) {
            if (err) {
                response.writeHead(503);
                response.end(JSON.stringify(err));
                return;
            }
            response.writeHead(200);
            response.end(data);
        })
    }
    if (request.url == '/status') {
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(agent_status));
    }
}

var server = http.createServer(handleRequest);

server.listen(config.http_server.listeningPort, function() {
    agent_status.http_service.running = true;
    console.log(colors.green('OK: ') + "HTTP Management Server started on port " + config.http_server.listeningPort);
});

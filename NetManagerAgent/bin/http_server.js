"use strict";
var http_server = exports;

var config = require('./../config/config.js');
var agent_config = require('./../config/agent.js');
var http = require('http');
var colors = require('colors/safe');
var os = require('os');
var fs = require('fs');


http_server.Start = function () {

    var server = http.createServer(handleRequest);

    server.listen(config.http_server.listeningPort, function () {
        agent_config.http_service.running = true;
        console.log(colors.green('OK: ') + "HTTP Management Server started on port " + config.http_server.listeningPort);
    });

}

function handleRequest(request, response) {

    // Route / to the status HTML page
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

    // Route /status to return the status as a JSON String
    if (request.url == '/status') {
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(agent_config));
    }

    // Route /hostname to return the Hostname as a JSON string
    if (request.url == '/hostname') {
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(os.hostname()));
    }

}

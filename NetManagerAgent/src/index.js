/*
    NetManager Agent - (c) Brendon Allen 2016
    -----------------------------------------

    start.js - Startup Bootstrapper for the NetManager Agent

 */

"use strict";
var config = require('./config/config.js');
import colors from 'colors/safe';
var Promise =require('bluebird');
var startup_db = require('./bin/startup_db.js');
import http_server from './bin/http_server.js';
var tasks = require('./tasks/index');

// Starup Information
console.log(colors.rainbow(" _   _      _   __  __                                           "));
console.log(colors.rainbow("| \\ | | ___| |_|  \\/  | __ _ _ __   __ _  __ _  ___ _ __       "));
console.log(colors.rainbow("|  \\| |/ _ \\ __| |\\/| |/ _` | '_ \\ / _` |/ _` |/ _ \\ '__|   "));
console.log(colors.rainbow("| |\\  |  __/ |_| |  | | (_| | | | | (_| | (_| |  __/ |          "));
console.log(colors.rainbow("|_| \\_|\\___|\\__|_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|    "));
console.log(colors.rainbow("                                         |___/                   "));
console.log('');
console.log('NetManager Agent - Starting Up');
console.log('Copyright (c) 2016 Brendon D Allen');
console.log('');
var server = new http_server();
server.Start();
console.log('');
console.log('***** Startup Sequence Checks *******');

// Run preflight checks before starting agent
startup_db.CheckDBExists()
    .then(startup_db.CheckAgentConfig)
    .then(tasks.startup)
    .catch((err) => {
        ErrHandle(err);
    });

//Promise.all([]);

/*
    Handle Startup Error Processes
 */
function ErrHandle(err) {
    if (err.code == 'ECONNREFUSED') {
        console.log(colors.red('*** FATAL *** : ') + ' CouchDB Not Running or misconfigured, please ensure CouchDB is running and is accessable. CouchDB URL ' + config.couchdb.url);
        process.exit();
    }
}



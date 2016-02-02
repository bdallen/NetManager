/*
    NetManager Agent - (c) Brendon Allen 2016
    -----------------------------------------

    start.js - Startup Bootstrapper for the NetManager Agent

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

"use strict";
var config = require('./../config/config.js');
var colors = require('colors/safe');
var Promise = require('bluebird');

var nano = require('nano-blue')(config.couchdb.url);

var startup_db = require('./startup_db.js');

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
var http_server = require('./http_server.js');
console.log('');
console.log('***** Startup Sequence Checks *******');

// Lets try and connect to the database server
try {
    var nmDb = nano.use(config.couchdb.db);
} catch (ex)
{
    console.log('* Database Server: ' + colors.red('FAIL'));
    console.log('Is Apache CouchDB Running?');
    process.exit();
}

// Run preflight checks before starting agent
startup_db.CheckDBExists(nmDb).then(startup_db.CheckAgentConfig(nmDb));
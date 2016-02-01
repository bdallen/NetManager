"use strict";
var config = require('./config.js');
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
console.log('Copyright (c) 2016 LevelUP Solutions Pty Ltd');
console.log('');
console.log('');
console.log('***** Database Checks *******');

// Lets try and connect to the database server
try {
    var nmDb = nano.use(config.couchdb.db);
} catch (ex)
{
    console.log('* Database Server: ' + colors.red('FAIL'));
    console.log('Is Apache CouchDB Running?');
    process.exit();
}

startup_db.CheckDBExists(nmDb).then(startup_db.CheckAgentConfig(nmDb));
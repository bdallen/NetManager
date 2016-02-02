"use strict";
var startup_db = exports;
var config = require('./../config/config.js');
var colors = require('colors/safe');
var Promise = require('bluebird');
var os = require('os');
var nano = require('nano-blue')(config.couchdb.url);

/*
    CheckDBExists(Database Object)
    ------------------------------
    Checks to see if it can fetch a record from the couch database, if not it will create the database and the initial configuration storage document.
 */
startup_db.CheckDBExists = function (nmDb) {

        // See if we can fetch the configuration document from the database
        return nmDb.get('netmanager-configuration').then((body) => {
            console.log(colors.green('OK: ') + 'Configuration Record in Database ');
            return true;
        }, (err) => {

                // We cant get the data, so we dont have a database probably, so lets create it
                return nano.db.create(config.couchdb.db).then((body) => {
                    console.log(colors.green('OK: ') +  'Created Database ' + config.couchdb.db);

                    // Write out the inital netmanager-configuration document
                    return nmDb.insert({_id: 'netmanager-configuration'}).then((body) => {
                        return true;
                    });

                }, (err) => {
                    throw(err);
                });
            });
};

/*
 CheckAgentConfig(Database Object)
 ------------------------------
 Checks to see if it can fetch a record from the couch database, if not it will create the database and the initial configuration storage document.
 */
startup_db.CheckAgentConfig = function (nmDb) {

    return nmDb.get('agent-' + os.hostname()).then((body) => {
        console.log(colors.green('OK: ') + 'Agent Configration Document Exists for host ' + os.hostname());
        return true;
    }, (err) => {
        return nmDb.insert({_id: 'agent-' + os.hostname()}).then((body) => {
            console.log(colors.yellow('INFO: ') + 'Created Agent configuration for ' + os.hostname());
            return true;
        }, (err) => {
            console.log(colors.red('FAIL: ') + 'Unable to create Agent configuration document.');
            throw (err);
        });
    });
};
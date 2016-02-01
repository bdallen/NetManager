"use strict";
var startup_db = exports;
var config = require('./config.js');
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

    return new Promise( function (resolve, reject) {

        // See if we can fetch the configuration document from the database
        nmDb.get('netmanager-configuration').then(function () {
            console.log('* Configuration Record in Database ' + colors.green(config.couchdb.db) + ' exists.');
            resolve(nmDb);
        })
        // Unable to fetch the record, we probably dont have a database created
        .catch(function () {

            // Try to create the database and instill the configuration document initially.
            nano.db.create(config.couchdb.db).then(function () {
                console.log('* Created Database: ' + colors.green(config.couchdb.db));
                nmDb.insert({_id: 'netmanager-configuration'}).catch(function (err) {
                    reject(err);
                });
                return resolve(nmDb);
            }).catch(function (err) {
                console.log('* Database Creation: ' + colors.red('FAILED'));
                reject(err);
            });

        });
    });
};

/*
 CheckAgentConfig(Database Object)
 ------------------------------
 Checks to see if it can fetch a record from the couch database, if not it will create the database and the initial configuration storage document.
 */
startup_db.CheckAgentConfig = function (nmDb) {
    // See if we can fetch the configuration document from the database
    return nmDb.get('agent-' + os.hostname()).then(function () {
        console.log('* Agent configuration for ' + colors.green(os.hostname()) + ' exists.');
    }).catch( function () {
        console.log('* Agent configuration for ' + colors.red(os.hostname()) + ' does not exist.');
        return nmDb.insert({_id: 'agent-' + os.hostname()});
    });
};

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
            console.log(colors.green('OK: ') + 'Configuration Record in Database ');
            resolve(nmDb);
        })
        // Unable to fetch the record, we probably dont have a database created
        .catch(function () {

            // Try to create the database and instill the configuration document initially.
            nano.db.create(config.couchdb.db).then(function () {
                console.log(colors.green('OK: ') +  'Created Database ' + config.couchdb.db);
                nmDb.insert({_id: 'netmanager-configuration'}).catch(function (err) {
                    reject(err);
                });
                return resolve(nmDb);
            }).catch(function (err) {
                ErrorHandler(err);
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
    return new Promise( function (resolve, reject) {

        // See if we can fetch the configuration document from the database
        nmDb.get('agent-' + os.hostname()).then(function () {
            console.log('* Agent configuration for ' + colors.green(os.hostname()) + ' exists.');
            resolve(nmDb);

        }).catch(function () {

            console.log('* Agent configuration for ' + colors.red(os.hostname()) + ' does not exist.');
            nmDb.insert({_id: 'agent-' + os.hostname()}).then(function () {
                console.log('* Created Agent configuration for ' + colors.yellow(os.hostname()));
                resolve(nmDb);
            }).catch(function (err) {
               console.log('* Creation of Agent configuration: ' + colors.red('FAIL'));
                reject(err);
            });

        });
    });
};

/*
    ErrorHandler(err)
    -----------------
    Handles fatal errors.
 */
function ErrorHandler(err)
{
    if (err.code === "ECONNREFUSED")
    {
        console.log(colors.red('FATAL: ') + 'Database Server Not Running. Please check CouchDB is running and accessable at ' + config.couchdb.url);
    }
}
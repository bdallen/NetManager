"use strict";
var startup_db = exports;
var config = require('./config.js');
var colors = require('colors/safe');
var Promise = require('bluebird');
var nano = require('nano-blue')(config.couchdb.url);

/*
    CheckDBExists(Database Object)
    ------------------------------
    Checks to see if it can fetch a record from the couch database, if not it will create the database and the initial configuration storage document.
 */
startup_db.CheckDBExists = function (nmDb) {
    return Promise.try(function() {

        // See if we can fetch the configuration document from the database
        return nmDb.get('netmanager-configuration').then(function () {
            console.log('* Configuration Record in Database ' + colors.green(config.couchdb.db) + ' exists.');
        });

    // Unable to fetch the record, we probably dont have a database created
    }).catch( function(err,res) {

        // Try to create the database and instill the configuration document initially.
        return nano.db.create(config.couchdb.db).then(function () {
            console.log('* Created Database: ' + colors.green(config.couchdb.db));
            return nmDb.insert({_id: 'netmanager-configuration'});
        }).catch(function () {
            console.log('* Database Creation: ' + colors.red('FAILED'));
        });
    });

};

/*
 CheckAgentConfig(Database Object)
 ------------------------------
 Checks to see if it can fetch a record from the couch database, if not it will create the database and the initial configuration storage document.
 */
startup_db.CheckAgentConfig = function (nmDb) {
    return Promise.try(function() {
        nmDb.insert({_id: 'netmanager-configuration'}, function(err,res) {
            if(err)
            {
                throw new Error('Unable To Create Main Configuration');
            }
            console.log('* Created Main Configuration Record: ' + colors.green('OK'));
            return true;
        });
    });
};

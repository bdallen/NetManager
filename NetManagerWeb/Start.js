var config = require("./config.js");                            // Config file
var Startup = require('./startup.js');

var colors = require('colors/safe');
var cradle = require('cradle');
var nano = require('nano')(config.couchdb.url);
var Promise = require("native-or-bluebird");
var Chains = require("bluebird-chains");

// Starup Information
console.log('---- NetManager Web Application Bootstrap ----');
console.log('* Checking System');

// Lets start the process of getting setup
try {
  var db = nano.db.use(config.couchdb.db);
} catch (ex)
{
  console.log('* Database Server: ' + colors.red('FAIL'));
  console.log('   Is Apache CouchDB Running?');
  process.exit();
}

// Check all systems are Sane then fire up the web service
Startup.checkDBSetup(db).then(Startup.checkDBViews(db)).then(function(){
  console.log('* System Startup: ' + colors.green('OK'));
  console.log('* Starting Web Service');
  var WebServer = require('./bin/www');
});

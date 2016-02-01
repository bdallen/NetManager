var Startup = exports;

var colors = require('colors/safe');
var Promise = require("native-or-bluebird");

  // Check the Database Server if the database is setup
  Startup.checkDBSetup = function (db) {
      return new Promise(function (resolve, reject) {
          return db.get('netmanager-configuration', function(err, doc){
            if (err != null) {
              console.log('Configuration Record: ' + colors.red('FAIL'));
              console.log(err);
              return db.insert({ _id: 'netmanager-configuration', test: 'ok'}, function (err, res) {
                if (err != null) {
                  return reject(err);
                }
              });
            }
            else {
              console.log('* Configuration Record: ' + colors.green('OK'));
              return resolve(db);
            }
          });
      });
  };

  // Preconfigure Views Required if they dont exist
  Startup.checkDBViews = function (db) {
    return new Promise(function (resolve, reject) {
      View_VRF(db).then(
          View_DeviceList(db).then(
              View_PingResults(db).then(
                  function(){ console.log('* Database Check: ' + colors.green('OK'));},
                  function(){console.log('* Database Check: '+ colors.red('FAIL')); process.exit();})
          )
      );
    });
  }

// Check the View VRF
function View_VRF(db) {
  return new Promise(function (resolve, reject){
    return db.get('_design/VRF', function(err, doc){
      if (err != null) {
        console.log("Creating _design/VRF view");
        return db.insert({ "views": {
          "discovered_list": { "map": function (doc) {if (doc.type == 'DiscoveredVRF') emit(doc._id, doc);} },
          "list": { "map": function (doc) {if (doc.type == 'VRF') emit(doc._id, doc);} },
        } }, '_design/VRF', function (err, res) {
          if (err != null) {
            return reject(err);
          }
        });
      }
      else {
        console.log('* VRF Listing  View: ' + colors.green('OK'));
        return resolve(db);
      }
    });
  });
}

// CHeck the View Device List
function View_DeviceList(db) {
  return new Promise(function (resolve, reject){
    return db.get('_design/DiscoveredDeviceListing', function(err, doc){
      if (err != null) {
        console.log("Creating _design/DiscoveredDeviceListing view");
        return db.insert({ "views": {
          "complete_list": { "map": function (doc) {if (doc.type == 'DiscoveredDevice') emit(doc._id, doc);} }
        } }, '_design/DiscoveredDeviceListing', function (err, res) {
          if (err != null) {
            return reject(err);
          }
        });
      }
      else {
        console.log('* Device Listing View: ' + colors.green('OK'));
        return resolve(db);
      }
    });
  });
}

// Check the View Ping Results
function View_PingResults(db) {
  return new Promise(function (resolve, reject){
    return db.get('_design/PingResults', function(err, doc){
      if (err != null) {
        console.log("Creating _design/PingResults view");
        return db.insert({ "views": {
          "max": { "map": function (doc) {if (doc.type == 'PingResult') {
            for (var idx in doc.pingResults) { emit(doc.pingResults[idx].sampleTime, doc.pingResults[idx].maximum);}
          } } },
          "min": { "map": function (doc) {if (doc.type == 'PingResult') {
            for (var idx in doc.pingResults) { emit(doc.pingResults[idx].sampleTime, doc.pingResults[idx].minimum);}
          } } },
          "avg": { "map": function (doc) {if (doc.type == 'PingResult') {
            for (var idx in doc.pingResults) { emit(doc.pingResults[idx].sampleTime, doc.pingResults[idx].average);}
          } } },
        } }, '_design/PingResults', function (err, res) {
          if (err != null) {
            return reject(err);
          }
        });
      }
      else {
        console.log('* Ping Results View: ' + colors.green('OK'));
        return resolve(db);
      }
    });
  });
}

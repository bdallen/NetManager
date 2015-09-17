var express = require('express');
var config = require("../../config.js");

var router = express.Router();

// Setup the Database Connection
var conndb = require('nano')(config.couchdb.url);
db = conndb.db.use(config.couchdb.db);

/* GET home page. */
router.get('/endpoints', function(req, res, next) {
    db.view('DiscoveredDeviceListing', 'complete_list'
    , function (err, result) {
      if (err) console.log(err);
      res.status(200).send(result.rows);
  });
});

/* GET home page. */
router.get('/endpoints/:mac/ping/max', function(req, res, next) {
  db.temporaryView({
    map: function(doc) {
      console.log("output", { mac: doc.macAddress, params: req.params });
          if (doc.type == 'EndpointPing' && doc.macAddress == req.params.id) {
            for (var idx in doc.pingResults) {
              emit(doc.pingResults[idx].sampleTime, doc.pingResults[idx].maximum);
            }
          }
        }
  }, function (err, result) {
    if (err) console.log(err);
    res.status(200).send(result);
  });
});

module.exports = router;

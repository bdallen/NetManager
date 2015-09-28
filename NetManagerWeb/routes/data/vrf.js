var express = require('express');
var config = require("../../config.js");

var router = express.Router();

// Setup the Database Connection
var conndb = require('nano')(config.couchdb.url);
db = conndb.db.use(config.couchdb.db);

/* GET home page. */
router.get('/list/discovered', function(req, res, next) {
    db.view('VRF', 'discovered_list'
    , function (err, result) {
      if (err) console.log(err);
      res.status(200).send(result.rows);
  });
});

module.exports = router;

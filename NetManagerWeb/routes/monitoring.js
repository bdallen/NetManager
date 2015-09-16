var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('monitoring/index', { title: 'NetManager', page: 'Monitoring' });
});

/* GET home page. */
router.get('/endpoints', function(req, res, next) {
  res.render('monitoring/endpoint-list', { title: 'Endpoints'});
});

router.get('/graph-test', function(req, res, next) {
  res.render('monitoring/endpoint-graphtest', { title: 'Latency Graph'});
});

module.exports = router;

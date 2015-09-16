var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/index', { title: 'NetManager', page: 'Administration' });
});

/* GET home page. */
router.get('/agents', function(req, res, next) {
  res.render('admin/agents', { title: 'NetManager - Agents'});
});

module.exports = router;

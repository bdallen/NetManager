var express = require('express');
var router = express.Router();

var MikroNode = require('mikronode');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('Mikrotik/index', { title: 'MikroManager - Mikrotik' });
});

// Interface Listings
router.get('/:id/interfaces',function(req,res,next){
  var connection = new MikroNode(req.params.id, 'admin', 'passw0rd');
  connection.connect(function(conn) {
    var chan=conn.openChannel();
    chan.write('/interface/print',function(){
      chan.on('done',function(data){
        var parsed = MikroNode.parseItems(data);
        res.send(parsed);
        chan.close();
        chan.close();
        connection.close();
      });
    });
  });
});

// Layer2 Neighbor Discovery
router.get('/:id/neighbors',function(req,res,next){
  var connection = new MikroNode(req.params.id, 'admin', 'passw0rd');
  connection.connect(function(conn) {
    var chan=conn.openChannel();
    chan.write('/ip/neighbor/print',function(){
      chan.on('done',function(data){
        var parsed = MikroNode.parseItems(data);
        res.send(parsed);
        chan.close();
        chan.close();
        connection.close();
      });
    });
  });
});

// Router Ping
router.get('/:id/ping/:device',function(req,res,next){
  var connection = new MikroNode(req.params.id, 'admin', 'passw0rd');
  connection.connect(function(conn) {
    var chan=conn.openChannel();
    chan.write('/ping','=address='+req.params.device,'=count=4',function(){
      chan.on('done',function(data){
        var parsed = MikroNode.parseItems(data);
        res.send(parsed);
        chan.close();
        chan.close();
        connection.close();
      });
    });
  });
});

module.exports = router;

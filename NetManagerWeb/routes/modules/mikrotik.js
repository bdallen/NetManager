"use strict";

var config = require("../../config.js");   
var express = require('express');
var router = express.Router();

var mikronode = require('mikronode');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('Mikrotik/index', { title: 'MikroManager - Mikrotik' });
});

// Interface Listings
router.get('/:id/interfaces',function(req,res,next){

    var connection = mikronode.getConnection(req.params.id, config.mikrotikapi.username, config.mikrotikapi.password, {closeOnDone: true});

    connection.getConnectPromise().then((conn) => {
      return conn.getCommandPromise("/interface/print");
    }).then((result) => {
      res.json(result);
    });

});

// Layer2 Neighbor Discovery
router.get('/:id/neighbors',function(req,res,next){
    var connection = mikronode.getConnection(req.params.id, config.mikrotikapi.username, config.mikrotikapi.password, {closeOnDone: true});
    connection.getConnectPromise().then((conn) => {
      return conn.getCommandPromise("/ip/neighbor/print");
    }).then((result) => {
      res.json(result);
    });
});

// Router Ping
router.get('/:id/ping/:device',function(req,res,next){
    var connection = mikronode.getConnection(req.params.id, config.mikrotikapi.username, config.mikrotikapi.password, {closeOnDone: true});
    connection.getConnectPromise().then((conn) => {
      return conn.getCommandPromise("/ping", {'=address': req.params.device, '=count': '4'});
    }).then((result) => {
      res.json(result);
    });
});

module.exports = router;

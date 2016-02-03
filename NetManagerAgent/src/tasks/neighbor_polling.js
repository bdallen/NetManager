/**
 * Created by brendonallen on 3/02/16.
 */

"use strict";
var tasks = exports;

var config = require('./../config/config.js');
var agent_config = require('./../config/agent.js');
var Promise =require('bluebird');
var nano = require('nano-blue')(config.couchdb.url);


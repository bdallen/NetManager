/**
 * Created by brendonallen on 3/02/16.
 */

"use strict";
var config = require('./../config/config.js');
var agent_config = require('./../config/agent.js');
var Promise =require('bluebird');
var nano = require('nano-blue')(config.couchdb.url);
import mikronode from 'mikronode';

export default class NodeDiscoveryService {

    RunJob()
    {
        var Neighbors = this.GetNeighbors();
        this.AddRouter().then((body) => {console.log(body);});
    }

    GetNeighbors()
    {
        var connection = mikronode.getConnection('10.232.0.9', 'admin', 'passw0rd', {closeOnDone: true});

        connection.getConnectPromise().then((conn) => {
            return conn.getCommandPromise("/ip/neighbor/print");
        }).then((result) => {
            return result;
        });
    }

    AddRouter()
    {
        var nmdb = nano.use(config.couchdb.db);
        return Promise.resolve(nmdb.get('PE-Routers')
            .then((body) => {return body;}))
            .then((body) => {return body;});
    }

}

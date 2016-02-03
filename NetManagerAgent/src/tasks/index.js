
"use strict";
var tasks = exports;
var CronJob = require('cron').CronJob;
var agent_config = require('./../config/agent.js');

var neighbor_discovery = require('./neighbor_discovery.js');

tasks.startup = function () {

    console.log('**** Processing Tasks ****');

    // Agent Configuration and Status Updates Job
    var AgentConfigStatusUpdates = new CronJob('* * * * * *', function() {
        console.log('--- Agent Update Packet ----')
    });

    // Neighbor Discovery Service Job
    var DiscoveryService = new CronJob(agent_config.neighbor_discovery_service.cron, function() {

    });

    // Start the various services
    AgentConfigStatusUpdates.start();

    if (agent_config.neighbor_discovery_service.enabled) {
        DiscoveryService.start();
    }
}

function CheckTasks() {

}
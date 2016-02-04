
"use strict";
var tasks = exports;
var CronJob = require('cron').CronJob;
var agent_config = require('./../config/agent.js');
import NeighborDiscoveryService from './neighbor_discovery';

tasks.startup = function () {

    console.log('**** Processing Tasks ****');

    var nds = new NeighborDiscoveryService();

    // Agent Configuration and Status Updates Job
    var AgentConfigStatusUpdates = new CronJob('20 * * * * *', function() {
    });

    // Neighbor Discovery Service Job
    var DiscoveryService = new CronJob(agent_config.neighbor_discovery_service.cron, function() {
        nds.RunJob();
    });

    // Start the various services
    AgentConfigStatusUpdates.start();

    if (agent_config.neighbor_discovery_service.enabled) {
        DiscoveryService.start();
    }
}

function CheckTasks() {

}
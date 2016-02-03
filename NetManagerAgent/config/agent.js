/*
 NetManager Agent - (c) Brendon Allen 2016
 -----------------------------------------

 agent.js - Storage of Dynamic Agent Configuration

 */

"use strict";
var agent_config = module.exports = {};

/*
    HTTP Service
 */
agent_config.http_service = {};
agent_config.http_service.enabled = true;
agent_config.http_service.running = false;

/*
    Neighbor Discovery Service
 */
agent_config.neighbor_discovery_service = {};
agent_config.neighbor_discovery_service.enabled = false;
agent_config.neighbor_discovery_service.cron = '60 * * * * *';
agent_config.neighbor_discovery_service.running = false;

/*
 Neighbor Monitoring Service
 */
agent_config.neighbor_monitoring_service = {};
agent_config.neighbor_monitoring_service.enabled = false;
agent_config.neighbor_monitoring_service.cron = '60 * * * * *';
agent_config.neighbor_monitoring_service.running = false;
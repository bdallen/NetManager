/*
 NetManager Agent - (c) Brendon Allen 2016
 -----------------------------------------

 status.js - Storage of Service Status

 */

"use strict";
var agent_status = module.exports = {};

/*
    HTTP Service Status
 */
agent_status.http_service = {};
agent_status.http_service.running = false;

/*
    Neighbor Polling Status
 */
agent_status.neighbor_poll = {};
agent_status.neighbor_poll.running = false;

agent_status.neighbor_discovery = {};
agent_status.neighbor_discovery.running = false;
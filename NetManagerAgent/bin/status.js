/*
 NetManager Agent - (c) Brendon Allen 2016
 -----------------------------------------

 status.js - Storage of Service Status

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
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
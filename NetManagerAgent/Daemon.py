#!/usr/bin/env python

import threading, configparser, schedule, collections, sys, time, couchdb, socket, select, Router, dbMappings

# -----------------------------
#| Maintenance Scheduler Loop |
#------------------------------
#
# Maintenance Loop
#
def MaintScheduler(q, db):
    schedule.every().hour.do(db.compact);
    schedule.every(2).hours.do(db.cleanup);
    while True:
        schedule.run_pending();
        time.sleep(1);

# ---------------------
#| Neighbor Discovery |
#----------------------
#
# Neighbor discovery loop
#
def NeighborDiscovery(q, db, strAgentName):

    # Load Agent Configuration for Discovery Thread
    discAgent = dbMappings.Agent.load(db, 'Agent-' + strAgentName)

    # Loop while agent is set to run
    while discAgent.discEnabled == True:

        # Refresh Agent Configuration from Database
        discAgent = dbMappings.Agent.load(db, 'Agent-' + strAgentName)

        # Read out the PE Routers from the database
        map_routers = '''function (doc) { if (doc.type === 'PERouter') {emit(doc,doc.name);}}''';
        results = db.query(map_routers);
        for router in results:
            Router.GetNeighbors(router, db);

        # Change Agent Status if Running
        if discAgent.discRunning == False:
            discAgent.discRunning = True
            discAgent.store(db);


        time.sleep(discAgent.discInterval);

    # Thread has been shutdown - set running to false
    discAgent.discRunning = False;
    discAgent.store(db);

# ----------------------
#| Neighbor Monitoring |
#-----------------------
#
# Neighbor Monitoring Loop
#
def MonitorNeighbors(q, db, strAgentName):

    # Load in the Agent Configuration for the Monitoring Loop
    monAgent = dbMappings.Agent.load(db, 'Agent-' + strAgentName)

    while True:

        # Refresh in agent Config
        monAgent = dbMappings.Agent.load(db, 'Agent-' + strAgentName)

        # Read out the discovered Devices from the database and run monitoring tasks
        map_endpoints ='''function (doc) { if(doc.type == 'DiscoveredDevice' && doc.monitor == 'true') {emit(doc,doc.name);}}''';
        results = db.query(map_endpoints);
        for endpoint in results:
            try:
                rtr = db.get(endpoint.key['seenBy']);
                Router.PingNeighbor(endpoint, rtr, db)
            except Exception:
                rtr = None
                endpoint = None
                results = None
                pass
        rtr = None
        endpoint = None
        results = None

        # Change Agent Status if Running
        if monAgent.probeRunning == False:
            monAgent.probeRunning = True
            monAgent.store(db);

        time.sleep(agent.probeInterval);

    # Thread has been shutdown - set running to false
    monAgent.probeRunning = False;
    monAgent.store(db);

# ---------------------------------------------------------------------------------

# Read in the config file
Config = configparser.ConfigParser();
Config.read("agent-config.conf");
strAgentName = Config.get('General', 'AgentName')

# Setup the Database Connection Parameters
dbServer = couchdb.client.Server(Config.get('Database','URL'));
db = dbServer[Config.get('Database','Name')];

# See if this agent exists in the database, if not create it.
agent = dbMappings.Agent.load(db, 'Agent-' + strAgentName)
if agent == None:
    agent = dbMappings.Agent(name = strAgentName);
    agent._set_id('Agent-' + strAgentName);
    agent.store(db);

# Reset Agent Status
agent.discRunning = False;
agent.probeRunning = False;
agent.store(db);

# Create the Maintenance Scheduler Thread
tMaintSched = threading.Thread(target=MaintScheduler, args=("M",db));
tMaintSched.daemon = True;
tMaintSched.start();

# Loop forever, doing something useful hopefully:
while True:
    # Refresh Agent Configuration and Status Data
    agent = dbMappings.Agent.load(db, 'Agent-' + strAgentName)

    if (agent.discEnabled == True and agent.discRunning == False):
        tNDiscovery = threading.Thread(target=NeighborDiscovery, args=("T",db, strAgentName));
        tNDiscovery.daemon = True;
        tNDiscovery.start();

    if (agent.probeEnabled == True and agent.probeRunning == False):
        tMonitor = threading.Thread(target=MonitorNeighbors, args=("T",db, strAgentName));
        tMonitor.daemon = True;
        tMonitor.start();

    agent = dbMappings.Agent.load(db, 'Agent-' + strAgentName)
    time.sleep(5);
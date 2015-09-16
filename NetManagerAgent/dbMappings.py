__author__ = 'brendonallen'

import couchdb
from couchdb.mapping import Document, TextField, IntegerField, BooleanField, DateTimeField, ListField, DictField, Mapping
from datetime import datetime

# ----------------------------
# | Agnet Ping Mapping Class |
# ----------------------------
class Agent(Document):
    type = TextField(default="AgentConfiguration")
    name = TextField()
    discEnabled = BooleanField(default=True)
    discInterval = IntegerField(default=60)
    discRunning = BooleanField(default=False)
    probeEnabled = BooleanField(default=True)
    probeInterval = IntegerField(default=60)
    probeRunning = BooleanField(default=False)
    command = TextField()
    errors = ListField(DictField(Mapping.build(
        ErrorDateTime = DateTimeField(default=datetime.now()),
        ErrorCategory = TextField(),
        ErrorDetails = TextField()
    )))

# ----------------------------------------------
# | Endpoint Mapping Class to CouchDB Document |
# ----------------------------------------------
class DiscoveredDevice(Document):
    type = TextField(default="DiscoveredDevice")
    seenBy = TextField()
    devName = TextField()
    ipAddress = TextField()
    platform = TextField()
    board = TextField()
    version = TextField()
    macAddress = TextField()
    monitor = TextField(default="false")

# -------------------------------
# | Endpoint Ping Mapping Class |
# -------------------------------
class PingResult(Document):
    type = TextField(default="PingResult")
    macAddress = TextField()
    status = TextField()
    pingResults = ListField(DictField(Mapping.build(
        sampleTime = DateTimeField(default=datetime.now()),
        minimum = TextField(),
        average = TextField(),
        maximum = TextField()
    )))

class DiscoveredDevicesList(Document):

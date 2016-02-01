var config = module.exports = {};

/*
    Agent Configuration
 */
config.http_server = {};
config.http_server.listeningPort = 9001;

/*
    CouchDB Configuration
 */
config.couchdb = {};
config.couchdb.url = 'http://127.0.0.1:5984';
config.couchdb.db = 'netmanager';

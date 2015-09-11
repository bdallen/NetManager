__author__ = 'brendonallen'

import couchdb, collections, string, sys, time, socket, select, MikrotikAPI, dbMappings

class Router:

    def GetNeighbors(router, db):
        try:
            sockRouter = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sockRouter.connect((router.key['ipaddress'], 8728));
            apiROS = MikrotikAPI.ApiRos(sockRouter);
            apiROS.login(router.key['username'], router.key['password']);
        except ValueError:
            return None
        try:
            strCommand = ["/ip/neighbor/print"];                                        # Command to print out the Neighoring Routers
            arrNeighbors = apiROS.talk(strCommand);                                     # Get the Array back from the PE Router
            for neighbor in arrNeighbors:                                               # Loop through the Results and insert into a dictionary list using MAC as primary Key
                if neighbor[0] != '!done':
                    try:
                        endpoint = dbMappings.DiscoveredDevice.load(db, 'discoveredDevice-' + neighbor[1]['=mac-address'].replace(":",""))
                        if endpoint == None:
                            endpoint = dbMappings.DiscoveredDevice(
                                   seenBy = router.key['_id'],
                                   devName= neighbor[1]['=identity'],
                                   platform = neighbor[1]['=platform'],
                                   board = neighbor[1]['=board'],
                                   version = neighbor[1]['=version'],
                                   macAddress = neighbor[1]['=mac-address'],
                            )
                            endpoint._set_id('discoveredDevice-' + neighbor[1]['=mac-address'].replace(":",""));
                            endpoint.store(db);
                        else:
                            changed = False;

                            # Update Router ID if a new router has seen this endpoint
                            if endpoint.seenBy != router.key['_id']:
                                endpoint.seenBy = router.key['_id']
                                changed = True;

                            # Update Version if it has changed
                            if endpoint.version != neighbor[1]['=version']:
                                endpoint.version = neighbor[1]['=version']
                                changed = True;

                            # Update IP Address if it has changed
                            if endpoint.ipAddress != neighbor[1]['=address4']:
                                endpoint.ipAddress = neighbor[1]['=address4']
                                changed = True;

                            # Update Board id it has changed
                            if endpoint.board != neighbor[1]['=board']:
                                endpoint.board = neighbor[1]['=board']
                                changed = True;

                            # Update the Name if it has changed
                            if endpoint.devName != neighbor[1]['=identity']:
                                endpoint.devName = neighbor[1]['=identity']
                                changed = True;

                            if changed == True:
                                endpoint.store(db);
                    except Exception:
                        pass
        except:
            pass
        try:
            sockRouter.close();
            sockRouter = None;
        except ValueError:
            print("Unable to connect to router");
            pass;
        return None

    def PingNeighbor(endpoint, router, db):
        try:
            sockRouter = socket.socket(socket.AF_INET, socket.SOCK_STREAM);
            sockRouter.connect((router['ipaddress'], 8728));
            apiROS = MikrotikAPI.ApiRos(sockRouter);
            apiROS.login(router['username'], router['password']);
        except ValueError:
            return None
        strCommand = ["/ping", "=address=" + endpoint.key['macAddress'], "=count=4"];
        arrPingResults = apiROS.talk(strCommand);
        result = arrPingResults[3]
        try:

            if result[1]['=received'] == "0":
                status = "OFFLINE"
            elif result[1]['=received'] == "4":
                status = "ONLINE"
            else:
                status = "LOSSY"

            epPingResults = dbMappings.PingResult.load(db, 'pingResult-' + endpoint.key['macAddress'].replace(":",""))
            if epPingResults == None:
                epPingResults = dbMappings.PingResult(
                        macAddress = endpoint.key['macAddress'].replace(":",""),
                        status = status,
                )
                epPingResults.pingResults.append(
                    minimum = result[1]['=max-rtt'].replace("ms","").replace("00:00:",""),
                    average = result[1]['=avg-rtt'].replace("ms","").replace("00:00:",""),
                    maximum = result[1]['=min-rtt'].replace("ms","").replace("00:00:","")
                )
                epPingResults._set_id('pingResult-' + endpoint.key['macAddress'].replace(":",""));
                epPingResults.store(db);
            else:
                epPingResults.pingResults.append(
                    minimum = result[1]['=max-rtt'].replace("ms","").replace("00:00:",""),
                    average = result[1]['=avg-rtt'].replace("ms","").replace("00:00:",""),
                    maximum = result[1]['=min-rtt'].replace("ms","").replace("00:00:","")
                )
                epPingResults.store(db);
        except Exception:
            pass
        try:
            sockRouter.close();
            sockRouter = None;
        except ValueError:
            print("Unable to connect to router");
            pass;
        return None
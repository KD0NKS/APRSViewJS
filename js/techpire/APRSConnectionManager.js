var TechpireAPRS = require('TechpireAPRS')
    , events = require('events')
	, Bacon = require('baconjs')
    , APRSPositionReport = require('TechpireAPRS').APRSPositionReport
    , AGWPEDataConnection = require('TechpireAPRS').AGWPEDataConnection
	;
/*
 As we add support for message filtering or station filtering (on position reports)
 look into using eep or RxJS.
 
 Data connetions themselves are intentionally non-observable objects.
 This is to prevent requiring KnockoutJS as a dependency in the TechpireAPRS module.
 To work around this, we all connections are wrapped as observables before being added to dataConnections.
 */

function APRSConnectionManager(aprsSettings, appSettingsDB) {
    var self = this;
    
    self.aprsSettings = aprsSettings;
    self.db = appSettingsDB;
    
	self.connectionFactory = new TechpireAPRS.APRSDataConnectionFactory();

	self.dataConnections = ko.observableArray();
    
    //self.allData = new Bacon.EventStream();
    
    self.messages = new Bacon.Bus();
    self.mapPackets = new Bacon.Bus();
    self.sentMessages = new Bacon.Bus();
    
    self.filteredMapPackets = self.mapPackets.filter(function(packet) {
        //return aprsSettings.allowedPacketFilters.indexOf(packet.messageType) > 0;
        
        if(aprsSettings.allowedPacketFilters.indexOf(packet.messageType) > 0) {
            if(!self.IsBlockedCallsign(packet.callsign)) {
                if(packet.symbolTableId == '/') {
                    return aprsSettings.stationTypeFilterSettings().indexOf(packet.symbolTableId + packet.symbolCode) > 0;
                } else {
                    return aprsSettings.stationTypeFilterSettings().indexOf(packet.symbolCode) > 0;
                }
            }
        }
        
        return false;
    });
    
    self.filteredMessages = self.messages.filter(function(packet) {
        if(aprsSettings.allowedPacketFilters.indexOf(packet.messageType) > 0) {
            return !self.IsBlockedCallsign(packet.callsign);
        }
        
        return false;
    });
            
    self.IsBlockedCallsign = function(callsign) {
        return (aprsSettings.blockedStationFilters.indexOf(callsign) > 0
                || aprsSettings.blockedStationFilters.indexOf(callsign.split('-')[0] + '*') > 0)
                ;
    };
    
    self.LoadConnections = function() {
        var args = Array();
        
        // load from database and add aprsSettings to each connection where appropriate
        self.db.find({ settingsName: 'DATA_CONNECTION' }, function (err, connections) {
            if(err) {
                console.log(err);   
            } else if(connections && connections.length > 0) {
                connections.forEach(function(connection) {
                    // build the physical connection
                    var dataConnection = self.connectionFactory.CreateDataConnection(connection);
                    
                    // Data connections do not have observable properties.  This is intentional!  Use ES5 to bind the connection to knockout
                    ko.track(dataConnection);
                    
                    // connection event listeners
                    dataConnection.on('connectionChange', function() {
                        self.UpdateConnection(dataConnection);
                    });
                    
                    // add the connection to our list of connections
                    self.dataConnections.push(dataConnection);
                    self.MonitorConnection(dataConnection);
                });
            } else {
                console.log('No data connections found, please check your station and data connection settings');   
            }
        });
    };
    
    self.UnloadConnections = function() {
        self.dataConnections.forEach(function(connection) {
            console.log('Disconnecting connection');
            connection.Disconnect();
        });
    };
    
    self.MonitorConnection = function(connection) {
        // listen for any data on the connection even if it's not enabled, when we enable it, we want to immediately get data
        self.sentMessages.plug(Bacon.fromEventTarget(connection, 'sending'));
        self.messages.plug(Bacon.fromEventTarget(connection, 'message'));
        self.mapPackets.plug(Bacon.fromEventTarget(connection, 'position'));
        self.mapPackets.plug(Bacon.fromEventTarget(connection, 'object'));
        
        //self.allData.concat(connection);
        
        //if(connection.connectionType == 'AGWPE') {
        //    connection.Monitor();
        //}
    };
    
    self.AddConnection = function(connection) {
        // save the connection info
        connection.callsign = self.aprsSettings.callsign();
        
        if(self.aprsSettings.ssid() && self.aprsSettings.ssid() != '') {
            connection.callsign = connection.callsign + '-' + self.aprsSettings.ssid()
        }
        
        connection.settingsName = 'DATA_CONNECTION';
        connection.passcode = self.aprsSettings.passcode();
        connection.softwareName = self.aprsSettings.SOFTWARE_NAME;
        connection.softwareVersion = self.aprsSettings.SOFTWARE_VERSION;
        connection.reconnectInterval = 60000;
        
        self.db.insert(connection, function(err, newConn) {
            if(err) {
                console.log('Failed to upsert station settings.');
                console.log(err);
            } else if(newConn) {
                connection = newConn;
                
                // build the physical connection
                //var dataConnection = self.connectionFactory.CreateDataConnection(connection);
                console.log('creating connection');
                
                var dataConnection = self.connectionFactory.CreateDataConnection(connection);
                ko.track(dataConnection);
                //console.log(dataConnection);

                // add the connection to our list of connections
                self.dataConnections.push(dataConnection);

                self.MonitorConnection(dataConnection);
            }
        });
    };
    
    /**
      * DO NOT UPDATE THE ISENABLED PROPERTY IN HERE!!!
      * It will result in an endliess recursive cycle.
      */
    self.UpdateConnection = function(connection) {
        if(self.aprsSettings.ssid() && self.aprsSettings.ssid() != '') {
            connection.callsign = self.aprsSettings.callsign() + '-' + self.aprsSettings.ssid()
        } else {
            connection.callsign = self.aprsSettings.callsign();   
        }
        
        connection.settingsName = 'DATA_CONNECTION';
        connection.passcode = self.aprsSettings.passcode();
        connection.softwareName = self.aprsSettings.SOFTWARE_NAME;
        connection.softwareVersion = self.aprsSettings.SOFTWARE_VERSION;
        
        // update by id
        self.db.update({ _id: connection.id }
            , {
                $set: {
                    description: connection.description
                    , host: connection.host
                    , port: (connection.port ? connection.port : undefined)
                    , radioPort: (connection.radioPort ? connection.radioPort : undefined)
                    , callsign: connection.callsign
                    , passcode: connection.passcode
                    , isEnabled: connection.isEnabled
                    , isTransmitEnabled: connection.isTransmitEnabled
                    , filter: (connection.filter ? connection.filter : undefined)
                }
            }
            , { upsert: true }
            , function(err) {
                if(err) {
                    console.log('Failed to upsert station settings.');
                    console.log(err);
                }
            }
        );
        
        // TODO: find connection in list and update values
                    
        var conn = ko.utils.arrayFirst(self.dataConnections(), function(c) {
            return c.id === connection.id;
        });
        
        conn.callsign = connection.callsign;
        conn.passcode = connection.passcode;
        conn.port = connection.port;
        conn.isTransmitEnabled = connection.isTransmitEnabled;
        conn.isReconnectOnFailure = connection.isReconnectOnFailure;
        conn.reconnectInterval = connection.reconnectInterval;
        conn.host = connection.host
        conn.description = connection.description;
        conn.callsign = connection.callsign;
        conn.passcode = connection.passcode;
        conn.isTransmitEnabled = connection.isTransmitEnabled;
        conn.filter = connection.filter;
        
        conn.radioPort = connection.radioPort;
        
        //conn.isEnabled = connection.isEnabled;
    };
    
    self.DeleteConnection = function(connection) {
        // disable the connection
        connection.isEnabled = false;
        
        // remove from database
        self.db.remove({ _id: connection.id }, function(err, numRemoved) {
            if(numRemoved > 0) {
                // if we deleted a connection, remove it from the list of connections
                self.dataConnections.remove(connection);
                
                // TODO: unplug from baconjs?
                /*
                stubbed in, needs testing
                self.sentMessages.unplug(Bacon.fromEventTarget(connection, 'sending'));
                self.messages.unplug(Bacon.fromEventTarget(connection, 'message'));
                self.mapPackets.unplug(Bacon.fromEventTarget(connection, 'position'));
                self.mapPackets.unplug(Bacon.fromEventTarget(connection, 'object'));
                */
            }
        });
    };
    
    // Send a packet (of any kind) out to all data connections where sending is enabled
    self.SendPacket = function(packet) {
        for(var c = 0; c < self.dataConnections().length; c++) {
            var connection = self.dataConnections()[c];
            
            if(connection.isEnabled && connection.isTransmitEnabled) {
                connection.Send(packet);
            }
        }
    };
    
    // CHANGE LISTENERS
    self.aprsSettings.callsign.subscribe(function(newVal) {
        for(var c = 0; c < self.dataConnections().length; c++) {
            var connection = self.dataConnections()[c];
            
            //connection.callsign = newVal;
            
            self.UpdateConnection(connection);
            
            // TODO: if aprsis connection send login?
        }
    });
    
    self.aprsSettings.ssid.subscribe(function(newVal) {
        for(var c = 0; c < self.dataConnections().length; c++) {
            var connection = self.dataConnections()[c];
            
            self.UpdateConnection(connection);
            
            // TODO: if aprsis connection send login?
        }
    });
    
    self.aprsSettings.passcode.subscribe(function(newVal) {
        for(var c = 0; c < self.dataConnections().length; c++) {
            var connection = self.dataConnections()[c];
            
            //connection.passcode = newVal;
            
            self.UpdateConnection(connection);
            
            // TODO: if aprsis connection send login?
        }
    });
}
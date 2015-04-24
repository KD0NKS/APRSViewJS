var TechpireAPRS = require('TechpireAPRS')
    , events = require('events')
	, Bacon = require('baconjs')
    , APRSPositionReport = require('TechpireAPRS').APRSPositionReport
    , AGWPEDataConnection = require('TechpireAPRS').AGWPEDataConnection
	;
/*
 As we add support for message filtering or station filtering (on position reports)
 look into using eep or RxJS.
 */

function APRSConnectionManager(aprsSettings, appSettingsDB) {
    var self = this;
    
    self.aprsSettings = aprsSettings;
    self.db = appSettingsDB;
    
	self.connectionFactory = new TechpireAPRS.APRSDataConnectionFactory();

	self.dataConnections = ko.observableArray();

	self.messages = new Bacon.Bus();
	self.mapPackets = new Bacon.Bus();
	self.sentMessages = new Bacon.Bus();
    
    // TODO: data connections need to be observables
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
    
    self.MonitorConnection = function(connection) {
        // listen for any data on the connection even if it's not enabled, when we enable it, we want to immediately get data
        self.sentMessages.plug(Bacon.fromEventTarget(connection, 'sending'));
        self.messages.plug(Bacon.fromEventTarget(connection, 'message'));
        self.mapPackets.plug(Bacon.fromEventTarget(connection, 'position'));
        self.mapPackets.plug(Bacon.fromEventTarget(connection, 'object'));
        
        if(connection.connectionType == 'AGWPE') {
            connection.Monitor();
        }
    }
    
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
                console.log(newConn);
                console.log(connection);
                
                connection = newConn;
            }
        });
        
        // build the physical connection
        var dataConnection = self.connectionFactory.CreateDataConnection(connection);

        // add the connection to our list of connections
        self.dataConnections.push(dataConnection);
        self.dataConnections.refresh(dataConnection);

        self.MonitorConnection(dataConnection);
    };
    
    self.UpdateConnection = function(connection) {
        connection.callsign = self.aprsSettings.callsign();
        
        if(self.aprsSettings.ssid() && self.aprsSettings.ssid() != '') {
            connection.callsign = connection.callsign + '-' + self.aprsSettings.ssid()
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
                    , callsign: connection.callsign
                    , passcode: connection.passcode
                    , isEnabled: connection.isEnabled
                    , isTransmitEnabled: connection.isTransmitEnabled
                    , filter: (connection.filter ? connection.filter : undefined)
                }
            }
            , { }
            , function(err) {
                if(err) {
                    console.log('Failed to upsert station settings.');
                    console.log(err);
                } else {
                    // TODO: find connection in list and update values
                    
                    var conn = ko.utils.arrayFirst(self.dataConnections(), function(c) {
                        return c.id === connection.id;
                    });
                    
                    //var e = connection.isEnabled;
                    
                    conn.description = connection.description;
                    conn.callsign = connection.callsign;
                    conn.passcode = connection.passcode;
                    //conn.isEnabled = e;
                    conn.isTransmitEnabled = connection.isTransmitEnabled;
                    conn.filter = connection.filter;
                }
            }
        );
    }
    
    self.DeleteConnection = function(connection) {
        // TODO: add disconnect functionality to connections!
        
        // disable the connection
        //set connection to isenabled = false
        //remove from database
        //self.dataConnections.remove(connection);
        // at this point we could leave it as disabled in memory since baconjs is still using it
        // or we could be nice to our ram and remove it
    }
    
    // Send a packet (of any kind) out to all data connections where sending is enabled
    self.SendPacket = function(packet) {
        for(var c = 0; c < self.dataConnections.length; c++) {
            var connection = self.dataConnections[c];

            if(connection.isEnabled && connection.isTransmitEnabled) {
                connection.Send(packet);
            }
        }
    };
    
    // CHANGE LISTENERS
    self.aprsSettings.callsign.subscribe(function(newVal) {
        for(var c = 0; c < self.dataConnections.length; c++) {
            var connection = self.dataConnections[c];
            
            connection.callsign = newVal;
            
            
            // TODO: if aprsis connection send login
            //SendLogin
        }
    });
    
    self.aprsSettings.ssid.subscribe(function(newVal) {
        for(var c = 0; c < self.dataConnections.length; c++) {
            var connection = self.dataConnections[c];
            
            connection.ssid = newVal;
            
            self.UpdateConnection(connection);
            
            // TODO: if aprsis connection send login
            //SendLogin
        }
    });
    
    self.aprsSettings.passcode.subscribe(function(newVal) {
        for(var c = 0; c < self.dataConnections.length; c++) {
            var connection = self.dataConnections[c];
            
            console.log(connection instanceof AGWPEDataConnection);
            
            self.UpdateConnection(connection);
        }
    });
}
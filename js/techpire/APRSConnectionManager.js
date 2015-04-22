var TechpireAPRS = require('TechpireAPRS')
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
    
    self.LoadConnections = function() {
        // TODO: foreach data connection
        var args = Array();
        
        // load from database and add aprsSettings to each connection where appropriate
        
        /*
        args['connectionType'] = 'APRSIS';
        args['description'] = 'Unnamed Connection';
        args['callsign'] = 'N0CALL';
        args['host'] = '';
        args['port'] = 10154;
        args['filter'] = '';
        args['isEnabled'] = false;
        args['isTransmitEnabled'] = false;
        args['isReconnectOnFailure'] = true;
        args['keepAliveTime'] = 60000;
        args['softwareName'] = SOFTWARE_NAME;
        args['softwareVersion'] = SOFTWARE_VERSION;
        
        self.AddConnection(args);
        */
    };
    
    self.AddConnection = function(connection) {
        connection.data.set({'callsign': self.aprsSettings.callsign()});
        connection.data.push({'passcode': self.aprsSettings.passcode()});
        connection.data.push({'softwareName': self.aprsSettings.SOFTWARE_NAME});
        connection.data.push({'softwareVersion': self.aprsSettings.SOFTWARE_VERSION});
        
        var dataConnection = self.connectionFactory.CreateDataConnection(connection);
        
        // TODO: Save the connection

        self.dataConnections.push(dataConnection);

        self.sentMessages.plug(Bacon.fromEventTarget(dataConnection, 'sending'));
        self.messages.plug(Bacon.fromEventTarget(dataConnection, 'message'));
        self.mapPackets.plug(Bacon.fromEventTarget(dataConnection, 'position'));
        self.mapPackets.plug(Bacon.fromEventTarget(dataConnection, 'object'));

        try {
            if(dataConnection.isEnabled === true) {
                dataConnection.Connect();

                //console.log(dataConnection instanceof AGWPEDataConnection);

                if(connection.connectionType == 'AGWPE') {
                //if(dataConnection instanceof AGWPEDataConnection) {
                    dataConnection.Monitor();
                }
            }
        } catch(e) {
            console.log(e);
        }
    };
    
    self.UpdateConnection = function(connection) {
        
    }
    
    self.DeleteConnection = function(connection) {
        // TODO: add disconnect functionality to connections!
        
        // disable the connection
        //self.dataConnections.remove(connection);
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
            
            // TODO: if aprsis connection send login
            //SendLogin
        }
    });
    
    self.aprsSettings.passcode.subscribe(function(newVal) {
        for(var c = 0; c < self.dataConnections.length; c++) {
            var connection = self.dataConnections[c];
            
            console.log(connection instanceof AGWPEDataConnection);
            
            // TODO: If it's an AGWPEDataConnection, set the passcode and send login
            //SendLogin
        }
    });
}
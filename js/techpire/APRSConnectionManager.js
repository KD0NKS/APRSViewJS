var TechpireAPRS = require('TechpireAPRS')
	, Bacon = require('baconjs')
    , APRSPositionReport = require('TechpireAPRS').APRSPositionReport
    , AGWPEDataConnection = require('TechpireAPRS').AGWPEDataConnection
	;
/*
 As we add support for message filtering or station filtering (on position reports)
 look into using eep or RxJS.
 */

function APRSConnectionManager(aprsSettings) {
    var self = this;
    
    self.aprsSettings = aprsSettings;
    
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
    
    self.AddConnection = function(args) {
        args['callsign'] = self.aprsSettings.callsign();
        args['passcode'] = self.aprsSettings.passcode();
        args['softwareName'] = self.aprsSettings.SOFTWARE_NAME;
        args['softwareVersion'] = self.aprsSettings.SOFTWARE_VERSION;
        
        var dataConnection = self.connectionFactory.CreateDataConnection(args);

        self.dataConnections.push(dataConnection);

        self.sentMessages.plug(Bacon.fromEventTarget(dataConnection, 'sending'));
        self.messages.plug(Bacon.fromEventTarget(dataConnection, 'message'));
        self.mapPackets.plug(Bacon.fromEventTarget(dataConnection, 'position'));
        self.mapPackets.plug(Bacon.fromEventTarget(dataConnection, 'object'));

        try {
            if(dataConnection.isEnabled === true) {
                dataConnection.Connect();

                //console.log(dataConnection instanceof AGWPEDataConnection);

                if(args['connectionType'] == 'AGWPE') {
                //if(dataConnection instanceof AGWPEDataConnection) {
                    dataConnection.Monitor();
                }
            }
        } catch(e) {
            console.log(e);
        }
    };
    
    /*
    
    
    self.DeleteConnection = function(connection) {
        // TODO: add disconnect functionality to connections!
        
        self.dataConnections.remove(connection);
    }
    */
    
    // Send a packet (of any kind) out to all data connections where sending is enabled
    self.SendPacket = function(packet) {
        for(var c = 0; c < self.dataConnections.length; c++) {
            var connection = self.dataConnections[c];

            if(connection.isEnabled && connection.isTransmitEnabled) {
                connection.Send(packet);
            }
        }
    };
}
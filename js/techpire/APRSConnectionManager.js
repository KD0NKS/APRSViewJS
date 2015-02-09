var TechpireAPRS = require('TechpireAPRS')
	, Bacon = require('baconjs')
    , APRSPositionReport = require('TechpireAPRS').APRSPositionReport
    , AGWPEDataConnection = require('TechpireAPRS').AGWPEDataConnection
	;
/*
 As we add support for message filtering or station filtering (on position reports)
 look into using eep or RxJS.
 */

var SOFTWARE_NAME = 'testsoftware';
var SOFTWARE_VERSION = 0;

var instance = null;

function APRSConnectionManager() {
    instance = this;
    
	this.connectionFactory = new TechpireAPRS.APRSDataConnectionFactory();

	this.dataConnections = new Array();

	this.messages = new Bacon.Bus();
	this.mapPackets = new Bacon.Bus();
	this.sentMessages = new Bacon.Bus();
}

APRSConnectionManager.prototype.LoadConnections = function() {
	// TODO: foreach data connection
	var args = Array();
    
    /*
	args['connectionType'] = 'APRSIS';
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
    
    instance.AddConnection(args);
    */
};

APRSConnectionManager.prototype.AddConnection = function(args) {
    var dataConnection = instance.connectionFactory.CreateDataConnection(args);
    
    instance.dataConnections.push(dataConnection);
    
    instance.sentMessages.plug(Bacon.fromEventTarget(dataConnection, 'sending'));
	instance.messages.plug(Bacon.fromEventTarget(dataConnection, 'message'));
	instance.mapPackets.plug(Bacon.fromEventTarget(dataConnection, 'position'));
	instance.mapPackets.plug(Bacon.fromEventTarget(dataConnection, 'object'));
    
	try {
        if(dataConnection.isEnabled === true) {
			dataConnection.Connect();
            
            //console.log(dataConnection instanceof AGWPEDataConnection);
            
            if(args['connectionType'] == 'AGWPE') {
            //if(dataConnection instanceof AGWPEDataConnection) {
                console.log('Enable Monitoring');
                dataConnection.Monitor();
            }
		}
	} catch(e) {
		console.log(e);
	}
};

APRSConnectionManager.prototype.SendPacket = SendPacket;

// Send a packet (of any kind) out to all data connections where sending is enabled
function SendPacket(packet) {
    for(var c = 0; c < instance.dataConnections.length; c++) {
        var connection = instance.dataConnections[c];
        
        if(connection.isEnabled && connection.isTransmitEnabled) {
            connection.Send(packet);
        }
    }
}
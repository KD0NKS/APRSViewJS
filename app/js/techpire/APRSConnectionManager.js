var TechpireAPRS = require('TechpireAPRS')
	, Bacon = require('baconjs')
	;
/*
 As we add support for message filtering or station filtering (on position reports)
 look into using eep or RxJS.
 */

var SOFTWARE_NAME = 'testsoftware';
var SOFTWARE_VERSION = 0;

function APRSConnectionManager() {
	this.connectionFactory = new TechpireAPRS.APRSDataConnectionFactory();
	
	this.dataConnections = new Array();
	
	this.messages = new Bacon.Bus();
	this.mapPackets = new Bacon.Bus();
	this.sentMessages = new Bacon.Bus();
}

APRSConnectionManager.prototype.LoadConnections = function() {
	var dataConnection = null;
	
	// TODO: foreach data connection
	var args = Array();
	
	args['connectionType'] = 'APRSIS';
	args['callsign'] = 'N0CALL';
	args['host'] = '';
	args['port'] = 10154;
	args['filter'] = '';
	args['isEnabled'] = false;
	args['isReconnectOnFailure'] = true;
	args['keepAliveTime'] = 60000;
	args['softwareName'] = SOFTWARE_NAME;
	args['softwareVersion'] = SOFTWARE_VERSION;
	
	dataConnection = this.connectionFactory.CreateDataConnection(args);
	
	dataConnection.Read();
	
	this.sentMessages.plug(Bacon.fromEventTarget(dataConnection, 'sending'));
	this.messages.plug(Bacon.fromEventTarget(dataConnection, 'message'));
	this.mapPackets.plug(Bacon.fromEventTarget(dataConnection, 'position'));
	
	try {
		if(dataConnection.isEnabled === true) {
			dataConnection.Connect();
		}
	} catch(e) {
		console.log(e);
	}
};
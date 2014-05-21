var TechpireAPRS = require('TechpireAPRS')
		;

var SOFTWARE_NAME = 'testsoftware';
var SOFTWARE_VERSION = 0;

function APRSConnectionManager() {
	var self = this;
	
	var connectionFactory = new TechpireAPRS.APRSDataConnectionFactory();
	var dataConnection = null;
	
	// TODO: foreach data connection
	var args = Array();
	args['connectionType'] = 'APRSIS';
	args['callsign'] = 'N0CALL';
	args['passcode'] = '-1';
	args['host'] = '';
	args['port'] = 10154;
	
	args['filter'] = '';
	
	args['isEnabled'] = false;
	args['isReconnectOnFailure'] = true;
	
	args['SOFTWARE_NAME'] = SOFTWARE_NAME;
	args['SOFTWARE_VERSION'] = SOFTWARE_VERSION;
	
	dataConnection = connectionFactory.CreateDataConnection(args);
	
	//dataConnection.Read();
	
	dataConnection.on('position', function(data) {
		console.log(data);
	});
	
	dataConnection.on('sending', function(data) {
		console.log(data);
	});
	
	dataConnection.on('message', function(data) {
		console.log(data);
	});
	
	try {
		//dataConnection.Connect();
	} catch(e) {
		console.log(e);
	}
}
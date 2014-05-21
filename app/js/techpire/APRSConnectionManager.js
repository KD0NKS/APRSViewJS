var TechpireAPRS = require('TechpireAPRS')
		;

//var SOFTWARE_NAME = 'testsoftware';
//var SOFTWARE_VERSION = 0;
		
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
	
	args['isEnabled'] = false;
	args['isReconnectOnFailure'] = true;
	
	args['softwareName'] = 'testsoftware';
	args['softwareVersion'] = 0;
	
	dataConnection = connectionFactory.CreateDataConnection(args);
	
	console.log(dataConnection.host);
	console.log(dataConnection.callsign);
	console.log(dataConnection);
	
	dataConnection.Read();
	
	//dataConnection.on('data', function(data) {
	//	console.log(data);
	//});
	
	try {
		dataConnection.Connect();
	} catch(e) {
		console.log(e);
	}
}
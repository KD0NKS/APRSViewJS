var TechpireAPRS = require('TechpireAPRS')
		;

function APRSConnectionManager() {
	var self = this;
	
	var connectionFactory = new TechpireAPRS.APRSDataConnectionFactory();
	
	// TODO: foreach data connection
	connectionFactory.CreateDataConnection('');
}
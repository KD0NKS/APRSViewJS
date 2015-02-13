var station = {};
var currentConnection = {};
var filter = {};

function loadSettings(e) {
	//Load in the Settings from DB
}


function APRSSettings() {
	//Storage of defaults here
	//Station
	basicSettings.callSign = "";
	basicSettings.callSignExt = "";
	basicSettings.pass = "";
	basicSettings.pointLifetime = 90;
	basicSettings.trackStation = false;
	
	//Data Connections
	currentConnection.type = "JavAPRSIS";
	currentConnection.description = "test central";
	currentConnection.server = "central.aprs2.net";
	currentConnection.port = 14580;
	currentConnection.filter = "r/39.257/-94.632/400";
	currentConnection.reconnect = true;
	currentConnection.enabled = true;
	
	//Filters
	filter.statusReport = false;
	filter.gpgga = false;
	filter.newMicE = false;
	filter.oldMicE = false;
	filter.position = false;
	filter.wxReport = false;
	filter.thirdParty = false;
	filter.query = false;
	filter.object = false;
	filter.item = false;
	filter.normal = false;
	filter.kill = false;
	filter.stationCapabilities = false;
	filter.telemetry = false;
	filter.userDefined = false;
	filter.message = false;
	filter.nws = false;		
}
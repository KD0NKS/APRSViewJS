/*******
	Settings for APRSView
****/
var station = {
		callSign: 'TEST',
		callSignExt: 'TEST',
		pass: 'TEST',
		pointLifetime: 90,
		trackStation: false
	}
	, currentConnection = {
		type: 'TEST',
		description: "",
		server: "",
		port: 8000,
		filter: "",
		reconnect: true,
		enabled: true
	}
	, filter = {
		statusReport: false,
		gpgga: false,
		newMicE: false,
		oldMicE: false,
		position: false,
		wxReport: false,
		thirdParty: false,
		query: false,
		object: false,
		item: false,
		normal: false,
		kill: false,
		stationCapabilities: false,
		telemetry: false,
		userDefined: false,
		message: false,
		nws: false
	};

APRSSettings.loadSettings = function(e) {
	//Load in the Settings from DB
}

APRSSettings.saveSettings = function(e) {
	//Save to DB
}

APRSSettings.SetupBindings = function(e) {
	this.station.callSign = '';
	this.station.callSignExt = '';
	this.station.pass = '';
	this.station.pointLifetime = 90;
	this.station.trackStation = false;
	
	APRSSettings.station = this.station;
}

function APRSSettings() {
	//Storage of defaults here
	//Station
	station.callSign = '';
	station.callSignExt = '';
	station.pass = '';
	station.pointLifetime = 90;
	station.trackStation = false;
	
}
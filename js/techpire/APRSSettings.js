/*******
	Settings for APRSView
****/
function Station(data) {
    this.callSign = ko.observable('N0CALL');       // Station callsign
    this.callSignExt = ko.observable();            // SSID
    this.pass = ko.observable('');                 // APRS-IS passcode
    this.pointLifetime = ko.observable(900000);    // must be in milliseconds
    this.trackStation = ko.observable(false);      // re-center the map on the user's station when it's heard
};

function Filter(data) {
    /*
    isEnabled
    displayName
    code
    */
    
    this.statusReport = ko.observable(false);
    this.gpgga = ko.observable(false);
    this.newMicE = ko.observable(false);
    this.oldMicE = ko.observable(false);
    this.position = ko.observable(false);
    this.wxReport = ko.observable(false);
    this.thirdParty = ko.observable(false);
    this.query = ko.observable(false);
    this.object = ko.observable(false);
    this.item = ko.observable(false);
    this.normal = ko.observable(false);
    this.kill = ko.observable(false);
    this.stationCapabilities = ko.observable(false);
    this.telemetry = ko.observable(false);
    this.userDefined = ko.observable(false);
    this.message = ko.observable(false);
    this.nws = ko.observable(false);
};

function APRSSettings(appSettingsDB, connectionManager, layerManager) {
    var self = this;
    var db = appSettingsDB;
    
	//Storage of defaults here
	self.callSign = '';
	self.callSignExt = '';
	self.pass = '';
	self.pointLifetime = 90;
	self.trackStation = false;
    
    // Observable settings objects
    self.station = null;
    self.filters = null; // TODO: Make this an array of simple filter 'objects'
    self.layers = ko.observableArray();
    
    self.loadSettings = function(e) {
        //Load station settings from the database
        self.station = new Station(data);
        
        // example findOne
        // this.options.storage.findOne({ point: self.options.displayName + ',' + tilePoint.z + ',' + tilePoint.x + ',' + tilePoint.y }, function (err, cachedTiles) {
        // https://github.com/louischatriot/nedb - see documentation
        
        // Load filters from the database
        //foreach filter setting
        //  filters.Push(new Filter(Data));
    };

    self.saveSettings = function(e) {
        //Save to DB
        
        // self.db.findOne({ 
        // try to find one
        //      if found
        //      else insert
        
        /*
        storage.insert(tileRecord, function(err, newRecord) {
            if(err) {
                console.log('Error saving New Tile: ' + err);
            }
        });
        */
    };
    
    self.cancelSave = function() {
        
    };
}
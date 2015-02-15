/*******
	Settings for APRSView
****/
function StationSettings(data) {
    this.settingsName = 'STATION_SETTINGS';
    this.callsign = ko.observable(data.callsign);       // Station callsign
    this.ssid = ko.observable(data.ssid);            // SSID
    this.passcode = ko.observable(data.passcode);                 // APRS-IS passcode
    this.pointLifetime = ko.observable(data.pointLifetime);    // must be in milliseconds
    this.trackStation = ko.observable(data.trackStation);      // re-center the map on the user's station when it's heard
};

function PacketFilterSettings(data) {
    this.settingsName = 'PACKET_FILTER_SETTINGS';
    this.statusReport = ko.observable(data.statusReport);
    this.gpgga = ko.observable(data.gpgga);
    this.newMicE = ko.observable(data.newMicE);
    this.oldMicE = ko.observable(data.oldMicE);
    this.position = ko.observable(data.position);
    this.wxReport = ko.observable(data.wxReport);
    this.thirdParty = ko.observable(data.thirdParty);
    this.query = ko.observable(data.query);
    this.object = ko.observable(data.object);
    this.item = ko.observable(data.item);
    this.normal = ko.observable(data.normal);
    this.kill = ko.observable(data.kill);
    this.stationCapabilities = ko.observable(data.stationCapabilities);
    this.telemetry = ko.observable(data.telemetry);
    this.userDefined = ko.observable(data.userDefined);
    this.message = ko.observable(data.message);
    this.nws = ko.observable(data.nws);
};

function APRSSettings(appSettingsDB, connectionManager, layerManager) {
    var self = this;
    
    self.db = appSettingsDB;
    
	//Storage of defaults here
	self.callsign = ko.observable('N0CALL');
	self.ssid = ko.observable('');
	self.passcode = ko.observable(-1);
	self.pointLifetime = ko.observable(90);
	self.trackStation = ko.observable(false);
    
    // Observable settings objects
    self.stationSettings = null;
    self.packetFilterSettings = null; // TODO: Make this an array of simple filter 'objects'
    self.connectionManager = connectionManager;
    self.layerManager = layerManager;
    
    self.reloadSettings = function() {
        console.log('reloading settings');
        
        // Load station settings from the database
        self.stationSettings = self.db.findOne({ settingsName: 'STATION_SETTINGS' }, function (err, stationSettings) {
            if(err) {
                console.log('Failed to load user settings.');
                console.log(err);
            } else if(stationSettings != null) {
                console.log('Settings Found!');
            
                self.callsign = self.stationSettings.callsign();
                self.ssid = self.stationSettings.ssid();
                self.passcode = self.stationSettings.passcode();
                self.pointLifetime = self.stationSettings.pointLifetime();
                self.trackStation = self.stationSettings.trackStation();
            } else {
                console.log('Settings NOT Found!');
                
                // lets load them into the database
                self.stationSettings = new StationSettings({
                    callsign: self.callsign()
                    , ssid: self.ssid()
                    , passcode: self.passcode()
                    , pointLifetime: self.pointLifetime()
                    , trackStation: self.trackStation()
                });
            }
        });
        
        // if found
        // Load filters from the database
        //foreach filter setting
        //  filters.Push(new Filter(Data));
        // else
        // self.filters = new Filter();
        
        // load layers
        // load connections
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
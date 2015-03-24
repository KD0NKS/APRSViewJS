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

function APRSSettings(appSettingsDB) {
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
    
    self.reloadSettings = function() {
        console.log('reloading settings');
        
        // Load station settings from the database
        self.db.findOne({ settingsName: 'STATION_SETTINGS' }, function (err, dbStationSettings) {
            if(err) {
                console.log('Failed to load user settings.');
                console.log(err);
            } else {
                // settings found from database
                if(dbStationSettings) {
                    self.callsign(dbStationSettings.callsign);
                    self.ssid(dbStationSettings.ssid);
                    self.passcode(dbStationSettings.passcode);
                    self.pointLifetime(dbStationSettings.pointLifetime);
                    self.trackStation(dbStationSettings.trackStation);
                    
                    self.stationSettings = new StationSettings(dbStationSettings);
                } else {
                    self.saveSettings();
                }
            }
        });
    };
    
    // inserts new record or updates the existing record using the upsert option
    self.saveSettings = function() {
        //Save to DB
        self.db.update({ settingsName: 'STATION_SETTINGS' }
            , {
                settingsName: 'STATION_SETTINGS'
                , callsign: self.callsign()
                , ssid: self.ssid()
                , passcode: self.passcode()
                , pointLifetime: self.pointLifetime()
                , trackStation: self.trackStation()
            }
            , { upsert: true }
            , function(err, updatedRecord) {
                if(err) {
                    console.log('Failed to upsert station settings.');
                    console.log(err);
                } else if(updatedRecord) {
                    if(self.stationSettings) {
                        self.stationSettings.callsign(updatedRecord.callsign);
                        self.stationSettings.ssid(updatedRecord.ssid);
                        self.stationSettings.passcode(updatedRecord.passcode);
                        self.stationSettings.pointLifetime(updatedRecord.pointLifetime);
                        self.stationSettings.trackStation(updatedRecord.trackStation);
                    } else {
                        self.stationSettings = new StationSettings(updatedRecord);
                    }
                }
            }
        );
    };
    
    self.cancelSave = function() {
        if(self.stationSettings != null) {
            self.callsign(self.stationSettings.callsign());
            self.ssid(self.stationSettings.ssid());
            self.passcode(self.stationSettings.passcode());
            self.pointLifetime(self.stationSettings.pointLifetime());
            self.trackStation(self.stationSettings.trackStation());
        } else {
            self.callsign('N0CALL');
            self.ssid('');
            self.passcode(-1);
            self.pointLifetime(90);
            self.trackStation(false);
        }
    };
}
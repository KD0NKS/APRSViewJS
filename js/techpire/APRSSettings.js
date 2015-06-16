/*******
	Settings for APRSView
****/
function StationSettings(data) {
    var self = this;
    
    self.settingsName = 'STATION_SETTINGS';
    
    self.callsign = ko.observable(data.callsign);       // Station callsign
    self.ssid = ko.observable(data.ssid);            // SSID
    self.passcode = ko.observable(data.passcode);                 // APRS-IS passcode
    self.pointLifetime = ko.observable(data.pointLifetime);    // must be in milliseconds
    self.trackStation = ko.observable(data.trackStation);      // re-center the map on the user's station when it's heard
    self.stationLatitude = ko.observable(data.stationLatitude);
    self.stationLongitude = ko.observable(data.stationLongitude);
    self.stationAutoPosition = ko.observable(data.stationAutoPosition);
    self.stationIcon = ko.observable(data.stationIcon);
    self.stationSendPositionInterval = ko.observable(data.stationSendPositionInterval); //ko.observable(data.stationSendPositionInterval); // in milliseconds
    
    self.stationSymbolTable = ko.computed(function() {
        if(self.stationIcon()) {
            return self.stationIcon()[0];
        } else {
            return '/';
        }
    });
    
    self.stationSymbolCode = ko.computed(function() {
        if(self.stationIcon()) {
            return self.stationIcon()[1];
        } else {
            return '-';
        }
    });
    
    self.sendPosition = ko.observable(true);
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
    
    self.SOFTWARE_NAME = 'testsoftware';
    self.SOFTWARE_VERSION = 0;
    self.AX_25_SOFTWAREVERSION = 'APZ678';
    
	//Storage of defaults here
	self.callsign = ko.observable('N0CALL');
	self.ssid = ko.observable('');
	self.passcode = ko.observable(-1);
	self.pointLifetime = ko.observable(90);
	self.trackStation = ko.observable(false);
    self.stationLatitude = ko.observable();
    self.stationLongitude = ko.observable();
    self.stationAutoPosition = ko.observable(false);
    self.stationIcon = ko.observable('/-');
    self.stationTransmitPosition = ko.observable(false);
    self.stationSendPositionInterval = ko.observable(1800000); // in milliseconds
    
    self.stationSymbolTable = ko.computed(function() {
        if(self.stationIcon()) {
            return self.stationIcon()[0];
        } else {
            return '/';   
        }
    });
    
    self.stationSymbolCode = ko.computed(function() {
        if(self.stationIcon()) {
            return self.stationIcon()[1];
        } else {
            return '-';   
        }
    });
    
    self.sendPosIntervalMin = ko.computed(function() {
        var time = (self.stationSendPositionInterval() / 60000);
        
        if(time % 1 == 0) {
            if(time > 1) {
                return time + ' min.';
            } else {
                return time + ' min.';
            }
        } else {
            if(time == 0.5) {
                return (time * 60) + ' sec.';
            } else {
                return Math.floor(time) + ' min. ' + ((time % 1) * 60) + ' sec.';
            }
        }
    });
    
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
                    self.stationLatitude(dbStationSettings.stationLatitude);
                    self.stationLongitude(dbStationSettings.stationLongitude);
                    self.stationAutoPosition(dbStationSettings.stationAutoPosition);
                    self.stationIcon(dbStationSettings.stationIcon);
                    self.stationSendPositionInterval(dbStationSettings.stationSendPositionInterval);
                    self.stationTransmitPosition(dbStationSettings.stationTransmitPosition);
                    
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
                , stationLatitude: self.stationLatitude()
                , stationLongitude: self.stationLongitude()
                , stationAutoPosition: self.stationAutoPosition()
                , stationIcon: self.stationIcon()
                , stationTransmitPosition: self.stationTransmitPosition()
                , stationSendPositionInterval: self.stationSendPositionInterval()
            }
            , { upsert: true }
            , function(err, updatedRecord) {
                if(err) {
                    console.log('Failed to upsert station settings.');
                    console.log(err);
                } else if(updatedRecord) {
                    if(self.stationSettings) {
                        console.log('Updating station settings');
                        
                        self.stationSettings.callsign(self.callsign());
                        self.stationSettings.ssid(self.ssid());
                        self.stationSettings.passcode(self.passcode());
                        self.stationSettings.pointLifetime(self.pointLifetime());
                        self.stationSettings.trackStation(self.trackStation());
                        self.stationSettings.stationLatitude(self.stationLatitude());
                        self.stationSettings.stationLongitude(self.stationLongitude());
                        self.stationSettings.stationAutoPosition(self.stationAutoPosition());
                        self.stationSettings.stationIcon(self.stationIcon());
                        self.stationSettings.stationTransmitPosition(self.stationTransmitPosition());
                        self.stationSettings.stationSendPositionInterval(self.stationSendPositionInterval());
                    } else {
                        // TODO: THIS IS INCORRECT, PASS A NEW OBJECT BASED ON THE ABOVE PROPERTIES
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
            self.stationLatitude(self.stationSettings.stationLatitude);
            self.stationLongitude(self.stationSettings.stationLongitude);
            self.stationAutoPosition(self.stationSettings.stationAutoPosition);
            self.stationIcon(self.stationSettings.stationIcon);
            self.stationSendPositionInterval(self.stationSettings.stationSendPositionInterval);
        } else {
            self.callsign('N0CALL');
            self.ssid('');
            self.passcode(-1);
            self.pointLifetime(90);
            self.trackStation(false);
            self.stationLatitude();
            self.stationLongitude();
            self.stationAutoPosition(false);
            self.stationIcon = ko.observable('/-');
            self.stationTransmitPosition = ko.observable(false);
            self.stationSendPositionInterval(1800000);
        }
    };
}
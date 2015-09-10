var TechpireAPRS = require('TechpireAPRS')
        , PacketTypeUtil = require('TechpireAPRS').PacketTypeUtil
        ;

/*******
	Settings for APRSView
****/
function StationSettings(data) {
    var self = this;
    
    self.settingsName = 'STATION_SETTINGS';
    
    self.callsign = ko.observable(data.callsign);       // Station callsign
    self.ssid = ko.observable(data.ssid);            // SSID
    self.passcode = ko.observable(data.passcode);                 // APRS-IS passcode
    self.comment = ko.observable(data.comment);
    self.pointLifetime = ko.observable(data.pointLifetime);    // must be in milliseconds
    self.trackStation = ko.observable(data.trackStation);      // re-center the map on the user's station when it's heard
    self.stationLatitude = ko.observable(data.stationLatitude);
    self.stationLongitude = ko.observable(data.stationLongitude);
    self.stationAutoPosition = ko.observable(data.stationAutoPosition);
    self.stationIcon = ko.observable(data.stationIcon);
    self.stationTransmitPosition = ko.observable(data.stationTransmitPosition);
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

function APRSSettings(appSettingsDB) {
    var self = this;
    
    self.db = appSettingsDB;
    
    self.SOFTWARE_NAME = 'testsoftware';
    self.SOFTWARE_VERSION = 0;
    self.AX_25_SOFTWAREVERSION = 'APZ678';
    
    self.packetTypeUtil = new PacketTypeUtil();
    self.stationMarkerIcon = new StationMarkerIcon();
    
	//Storage of defaults here
	self.callsign = ko.observable('N0CALL');
	self.ssid = ko.observable('');
	self.passcode = ko.observable(-1);
    self.comment = ko.observable('');
	self.pointLifetime = ko.observable(90);
	self.trackStation = ko.observable(false);
    self.stationLatitude = ko.observable();
    self.stationLongitude = ko.observable();
    self.stationAutoPosition = ko.observable(false);
    self.stationIcon = ko.observable('/-');
    self.stationTransmitPosition = ko.observable(false);
    self.stationSendPositionInterval = ko.observable(1800000); // in milliseconds
    
    // Observable settings objects
    self.stationSettings = new StationSettings(
        self
    );
    
    // Keep these two lists seperate as the allowed packet filters are sub arrays, which have to remain
    // intact for the checkbox values... or do they?  will && indexof each character work for the checked value?
    self.packetFilterSettings = new ko.observableArray([]);
    self.allowedPacketFilters = [];
    
    self.stationTypeFilterSettings = new ko.observableArray([]);
    
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
    
    // OTHER METHODS
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
                    self.comment(dbStationSettings.comment);
                    self.pointLifetime(dbStationSettings.pointLifetime);
                    self.trackStation(dbStationSettings.trackStation);
                    self.stationLatitude(dbStationSettings.stationLatitude);
                    self.stationLongitude(dbStationSettings.stationLongitude);
                    self.stationAutoPosition(dbStationSettings.stationAutoPosition);
                    self.stationIcon(dbStationSettings.stationIcon);
                    self.stationSendPositionInterval(dbStationSettings.stationSendPositionInterval);
                    self.stationTransmitPosition(dbStationSettings.stationTransmitPosition);
                    
                    self.stationSettings.callsign(self.callsign());
                    self.stationSettings.ssid(self.ssid());
                    self.stationSettings.passcode(self.passcode());
                    self.stationSettings.comment(self.comment());
                    self.stationSettings.pointLifetime(self.pointLifetime());
                    self.stationSettings.trackStation(self.trackStation());
                    self.stationSettings.stationLatitude(self.stationLatitude());
                    self.stationSettings.stationLongitude(self.stationLongitude());
                    self.stationSettings.stationAutoPosition(self.stationAutoPosition());
                    self.stationSettings.stationIcon(self.stationIcon());
                    self.stationSettings.stationTransmitPosition(self.stationTransmitPosition());
                    self.stationSettings.stationSendPositionInterval(self.stationSendPositionInterval());
                } else {
                    self.saveSettings();
                }
            }
        });
        
        // load default packet filter settings
        ko.utils.arrayForEach(self.packetTypeUtil.PacketTypes, function(f) {
            self.packetFilterSettings.push(f.code);
        });
        
        // load packet filters if they exist
        self.db.findOne({ settingsName: 'PACKET_FILTERS' }, function (err, filters) {
            if(err) {
                console.log('Failed to load packet filters');
                console.log(err);
            } else {
                if(filters) {
                    self.packetFilterSettings(filters.packetTypes);
                }
            }
        });
        
        self.allowedPacketFilters = [];
        
        ko.utils.arrayForEach(self.packetFilterSettings(), function(f) {
            self.allowedPacketFilters = self.allowedPacketFilters.concat(self.packetTypeUtil.GetSymbolsByCode(f));
        });
        
        // load default station type filters
        ko.utils.arrayForEach(self.stationMarkerIcon.symbols, function(symbol) {
            self.stationTypeFilterSettings.push(symbol.key);
        });
        
        self.db.findOne({ settingsName: 'STATION_TYPE_FILTERS' }, function(err, filters) {
            if(err) {
                console.log('Failed to load station tye filters');
                console.log(err);
            } else {
                if(filters) {
                    self.stationTypeFilterSettings(filters.symbols);
                }
            }
        });
    };
    
    // inserts new record or updates the existing record using the upsert option
    self.saveSettings = function() {
        //Save to DB
        self.db.update({ settingsName: 'STATION_SETTINGS' }
            , {
                $set: {
                    settingsName: 'STATION_SETTINGS'
                    , callsign: self.callsign()
                    , ssid: self.ssid()
                    , passcode: self.passcode()
                    , comment: self.comment()
                    , pointLifetime: self.pointLifetime()
                    , trackStation: self.trackStation()
                    , stationLatitude: self.stationLatitude()
                    , stationLongitude: self.stationLongitude()
                    , stationAutoPosition: self.stationAutoPosition()
                    , stationIcon: self.stationIcon()
                    , stationTransmitPosition: self.stationTransmitPosition()
                    , stationSendPositionInterval: self.stationSendPositionInterval()
                }
            }
            , { upsert: true }
            , function(err, updatedRecord) {
                if(err) {
                    console.log('Failed to upsert station settings.');
                    console.log(err);
                } else if(updatedRecord) {
                    if(self.stationSettings) {
                        self.stationSettings.callsign(self.callsign());
                        self.stationSettings.ssid(self.ssid());
                        self.stationSettings.passcode(self.passcode());
                        self.stationSettings.comment(self.comment());
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
                        //self.stationSettings = new StationSettings(updatedRecord);
                    }
                }
            }
        );
    };
    
    self.savePacketFilterSettings = function() {
        self.db.update(
            { settingsName: 'PACKET_FILTERS' }
            , {
                $set: {
                    packetTypes: self.packetFilterSettings()
                }
            }
            , { upsert: true }
            , function(err, numReplaced, upsert) {
                if(err) {
                    console.log(err);
                } else {
                    self.allowedPacketFilters = [];
                    
                    ko.utils.arrayForEach(self.packetFilterSettings(), function(f) {
                        self.allowedPacketFilters = self.allowedPacketFilters.concat(self.packetTypeUtil.GetSymbolsByCode(f));
                    });
                }
            }
        );
        
        return true;   
    };
    
    self.saveStationTypeFilterSettings = function() {
        self.db.update(
            { settingsName: 'STATION_TYPE_FILTERS' }
            , {
                $set: {
                    symbols: self.stationTypeFilterSettings()
                }
            }
            , { upsert: true }
            , function(err, numReplaced, upsert) {
                if(err) {
                    console.log(err);
                }
            }
        );
        
        return true;  
    };
    
    self.cancelSave = function() {
        if(self.stationSettings != null) {
            self.callsign(self.stationSettings.callsign());
            self.ssid(self.stationSettings.ssid());
            self.passcode(self.stationSettings.passcode());
            self.comment(self.stationSettings.comment());
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
            self.comment('');
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
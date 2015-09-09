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

function PacketFilterSettings(data) {
    var self = this;
    
    self.settingsName = 'PACKET_FILTERS';
    
    self.gpgga = ko.observable(data.gpgga);
    self.item = ko.observable(data.item);
    self.kill = ko.observable(data.kill);
    self.message = ko.observable(data.message);
    self.newMicE = ko.observable(data.newMicE);
    self.normal = ko.observable(data.normal);
    self.nws = ko.observable(data.nws);
    self.object = ko.observable(data.object);
    self.oldMicE = ko.observable(data.oldMicE);
    self.position = ko.observable(data.position);
    self.query = ko.observable(data.query);
    self.stationCapabilities = ko.observable(data.stationCapabilities);
    self.statusReport = ko.observable(data.statusReport);
    self.telemetry = ko.observable(data.telemetry);
    self.thirdParty = ko.observable(data.thirdParty);
    self.userDefined = ko.observable(data.userDefined);
    self.wxReport = ko.observable(data.wxReport);  
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
    
    self.packetFilterSettings = new PacketFilterSettings({
        gpgga: true
        , item: true
        , kill: true
        , message: true
        , newMicE: true
        , normal: true
        , nws: true
        , object: true
        , oldMicE: true
        , position: true
        , query: true
        , stationCapabilities: true
        , statusReport: true
        , telemetry: true
        , thirdParty: true
        , userDefined: true
        , wxReport: true
    });
    
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
        
        self.db.findOne({ settingsName: 'PACKET_FILTERS' }, function (err, filters) {
            if(err) {
                console.log('Failed to load packet filters');
                console.log(err);
            } else {
                if(filters) {
                    self.packetFilterSettings.gpgga(filters.gpgga)
                    , self.packetFilterSettings.item(filters.item)
                    , self.packetFilterSettings.kill(filters.kill)
                    , self.packetFilterSettings.message(filters.message)
                    , self.packetFilterSettings.newMicE(filters.newMicE)
                    , self.packetFilterSettings.normal(filters.normal)
                    , self.packetFilterSettings.nws(filters.nws)
                    , self.packetFilterSettings.object(filters.object)
                    , self.packetFilterSettings.oldMicE(filters.oldMicE)
                    , self.packetFilterSettings.position(filters.position)
                    , self.packetFilterSettings.query(filters.query)
                    , self.packetFilterSettings.stationCapabilities(filters.stationCapabilities)
                    , self.packetFilterSettings.statusReport(filters.statusReport)
                    , self.packetFilterSettings.telemetry(filters.telemetry)
                    , self.packetFilterSettings.thirdParty(filters.thirdParty)
                    , self.packetFilterSettings.userDefined(filters.userDefined)
                    , self.packetFilterSettings.wxReport(filters.wxReport)
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
                    settingsName: self.packetFilterSettings.settingsName
                    , gpgga: self.packetFilterSettings.gpgga()
                    , item: self.packetFilterSettings.item()
                    , kill: self.packetFilterSettings.kill()
                    , message: self.packetFilterSettings.message()
                    , newMicE: self.packetFilterSettings.newMicE()
                    , normal: self.packetFilterSettings.normal()
                    , nws: self.packetFilterSettings.nws()
                    , object: self.packetFilterSettings.object()
                    , oldMicE: self.packetFilterSettings.oldMicE()
                    , position: self.packetFilterSettings.position()
                    , query: self.packetFilterSettings.query()
                    , stationCapabilities: self.packetFilterSettings.stationCapabilities()
                    , statusReport: self.packetFilterSettings.statusReport()
                    , telemetry: self.packetFilterSettings.telemetry()
                    , thirdParty: self.packetFilterSettings.thirdParty()
                    , userDefined: self.packetFilterSettings.userDefined()
                    , wxReport: self.packetFilterSettings.wxReport()
                }
            }
            , { upsert: true }
            , function(err, numReplaced, upsert) {
                console.log(err);
                console.log(numReplaced);
                console.log(upsert);
                
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
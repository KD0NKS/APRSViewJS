/*
historical data layers... https://github.com/calvinmetcalf/leaflet.pouch
*/
var TechpireAPRS = require('TechpireAPRS')
    , ObjectReport = require('TechpireAPRS').ObjectReport
	, APRSPositionReport = require('TechpireAPRS').APRSPositionReport
    , APRSMessage = require('TechpireAPRS').APRSMessage
    , Datastore = require('nedb')
    , path = require('path')
    , settingsDB = new Datastore({ filename: path.join(require('nw.gui').App.dataPath, 'aprsViewSettingsDB.db') })
    , aprsSettings = new APRSSettings(settingsDB)
    , connectionManager = new APRSConnectionManager(aprsSettings, settingsDB)
    , layerDB = new Datastore({ filename: path.join(require('nw.gui').App.dataPath, 'aprsViewMapDB.db') })
    , layerManager = new LayerManager(layerDB)
    , gui = require('nw.gui')
    , stationMarkerIcon = new StationMarkerIcon()
    ;

layerDB.loadDatabase();
settingsDB.loadDatabase();

console.log('Saving layers to: ' + path.join(require('nw.gui').App.dataPath, 'aprsViewMapDB.db'));

/*
	1m = 60000 ms
	2.5m = 150000 ms
	5m = 300000 ms 	
	10m = 600000 ms
	15m = 900000 ms
	30m = 1800000 ms
	60m = 3600000 ms
	90m = 5400000 ms
*/

var TIMEOUT_PERIOD = 3600000;
var map = null;
var markersLayer = null;

var oldIcon = L.icon({ iconUrl: '../css/images/station/OldPoint.gif' });

// do DOM lookups once
var viewModel = null;
var mapEle = null;
var msgPanel = null;
var tabEle = null;

$(document).ready(function() {
    mapEle = $('#map');
    msgPanel = $('#allMessagesTable');
    
    $.when(
        layerManager.LoadMapLayers()
    ).done(function() {
        createMap(layerManager.baseLayer());

        viewModel = new pageViewModel();
        ko.applyBindings(viewModel);
        viewModel.SendPositionPacket();

        window.setInterval(viewModel.RemoveOldPositions, 60000); //600000

        // Set a mouse listener to update the status bar with the current latitude and longitude.
        // Set a timer to prevent the action event from executing for every pixel the mouse moves
        // this prevents spikes on the processor.
        var latLngUpdateDelay = 8;
        var resizeDelay = 500;
        var executionTimer;
        var resizeTimer;
        
        map.on('mousemove', function(e) {
            if(executionTimer) {
                clearTimeout(executionTimer);   
            }

            executionTimer = setTimeout(function() {
               viewModel.mouseLatLng(e.latlng);    
            }, latLngUpdateDelay);
        });
        
        // Lets not kill our cpu by resizing with every pixel change!
        $(window).on('resize', function(e) {
            if(resizeTimer) {
                clearTimeout(resizeTimer);   
            }
            
            resizeTimer = setTimeout(function() {
                resizeDynamicElements();
            }, resizeDelay);
        });
        
        resizeDynamicElements();

        $.when(
            connectionManager.LoadConnections()
            , readServerData(viewModel)
        ).done(function() {

        });
    });
});

function resizeDynamicElements() {
    console.log('resize');
    
    var h = $(window).innerHeight() - 43;
    
    map.invalidateSize();
    mapEle.height(h);
    map._onResize();
    
    
    h = $(window).innerHeight() - $('#messages').height() - $('mainAppTabs').height() - 74;
    
    msgPanel.height(h);
};

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var target = $(e.target).attr("href") // activated tab

    if((target == '#mapTab')) {
        $(window).trigger('resize');
    }
});



/*
 * Object containing all the points from which an individual station has reported from - location packet specific
 */
function StationTrail(data) {
	this.callsign = data.callsign;
	this.symbolTableId = data.symbolTableId;
	this.symbolCode = data.symbolCode;
	
	this.polyline = data.polyline;
	
	this.addPoint = function(point) {
		this.polyline.addLatLng(point);
	};
}

/*
 * Object containing all message objects - message packet specific
 */
function MessageObject(data) {
    this.receivedTime = ko.observable(data.receivedTime.toLocaleDateString() + '  ' + data.receivedTime.toLocaleTimeString());
	this.msgNumber = ko.observable(data.number);
	this.sourceCall = ko.observable(data.callsign);
	this.addressee = ko.observable(data.addressee);
	this.message = ko.observable(data.message);
	this.groupName = ko.observable(data.groupName);
    this.isAcked = ko.observable(false);
};

function pageViewModel() {
	var self = this;
    
    // map - status bar
    self.mouseLatLng = ko.observable(L.latLng(39, -99));
    self.lastStationHeard = ko.observable('');
	
	self.messageWindowMessages = ko.observableArray([]);
    self.messageAddressee = ko.observable('');
    self.messageText = ko.observable('');
    self.messageRequireAck = ko.observable('');
    
    self.aprsSettings = aprsSettings;
    self.aprsSettings.reloadSettings();
    
    // Data Connection Form - See DataConnection Form
    self.dcId = ko.observable();
    self.dcDescription = ko.observable('');
    self.dcConnectionType = ko.observable('APRSIS');
    self.dcHost = ko.observable('');
    self.dcPort = ko.observable(0);
    self.dcFilter = ko.observable('');
    self.dcRadioPort = ko.observable('');
    self.dcIsEnabled = ko.observable(false);
    self.dcIsTransmitEnabled = ko.observable(false);
    self.sendMessageInterval = null;
    
    // MESSAGES
	self.DeleteMessage = function(m) {
		self.messageWindowMessages.remove(m);
	};
    
    self.DeleteAllMessages = function() {
        self.messageWindowMessages([]);
    };
	
	// collection of markers for all stations on the map.
	// does knockout have a remove function on arrays?
	self.markers = ko.observableArray([]);

	// trails for all the stations on the map... in the future, this will only be for moving stations
	self.trails = ko.observableArray([]);
	
    
	// USE SLICE!!!!!
	self.RemoveOldPositions = function() {
		var checkNext = true;
		var now = new Date();
		var isContinue = true;
		
		// TODO: this should get the list of old markers and remove 
		var oldMarkers = self.markers.remove(function(m) {
			if((now.getTime() - m.options.receivedTime) >= TIMEOUT_PERIOD) {
				return markersLayer.removeLayer(ko.utils.unwrapObservable(m));
			}
		}); 
		
		for(var x = 0; x < oldMarkers.length; x++) {
			try {
				var m = oldMarkers[x];
				//markersLayer.removeLayer(ko.utils.unwrapObservable(m));
				
				/*
					If there is a trail associated with this station, remove the LAST (only 1) point at the given coordinates.
					It is theoretically possible the station could have sent a packet from the exact same position after having moved
					and gone back to the given position.  Yeah, it's unlikely given the output from the calculations, but lets just make sure.
				*/
				var trail = ko.utils.arrayFirst(self.trails(), function(t) {
					return (t.callsign == m.options.callsign && t.symbolTableId == m.options.symbolTableId && t.symbolCode == m.options.symbolCode);
				});
				
				if(trail != null && trail != undefined) {
					try {
						// To find the oldest point (FIFO) on the polyline that matches our criteria and remove it.
						// This shouldn't remove the point if the station sat idle for a few packets.  The 'idle' marker
						// receive time should have been updated rather than adding another point.
						// It's marker should have simply been updated rather than multiple markers at the same point added.
						var temp = trail.polyline.getLatLngs().filter(
							function(point) {
								return point.lat == m.getLatLng().lat && point.lng == m.getLatLng().lng
							}
						);
						
						if(temp.length > 0) {
							try {
								trail.polyline.spliceLatLngs(trail.polyline.getLatLngs().indexOf(temp[0]), 1);
								//console.log('Trail point removal success for: ' + trail.callsign);
							} catch(e) {
								console.log(e);
								console.log(e.stack);
							}
						} else {
							console.log('no point found');
						}
					} catch(e) {
						console.log(e);
						console.log(e.stack);
					}
				}
			} catch(e) {
				console.log(e);
				console.log(e.stack);
			}
		}
	};
    
    
    self.SendMessage = function() {
        // TODO: Validate callsign?
        if(self.messageAddressee() != '' && self.messageText() != '' && self.messageText().length < 67 && aprsSettings.callsign() != '' && aprsSettings.callsign() != 'N0CALL') {
            var msg = new APRSMessage();
            
            msg.callsign = self.aprsSettings.stationSettings.callsign();
            
            if(self.aprsSettings.stationSettings.ssid && self.aprsSettings.stationSettings.ssid() != '') {
                msg.callsign = msg.callsign + '-' + self.aprsSettings.stationSettings.ssid();
            }
            
            msg.destination = self.aprsSettings.AX_25_SOFTWAREVERSION;
            msg.addressee = self.messageAddressee().trim();
            msg.messageType = ':';
            msg.message = self.messageText().trim();
            msg.digipeaters.push('WIDE2-1');
            
            console.log(msg);
            connectionManager.SendPacket(msg);
            
            self.messageText('');
        }
    };
    
    self.SendPositionPacket = function() {
        console.log("Send Position");
        
        try {
            if(aprsSettings.stationSettings 
                    && aprsSettings.stationSettings.callsign
                    && aprsSettings.stationSettings.callsign() != null
                    && self.aprsSettings.stationSettings.stationLatitude() != null
                    && self.aprsSettings.stationSettings.stationLongitude() != null) {
                console.log("Send Position");
                
                var posRpt = new APRSPositionReport();

                posRpt.callsign = aprsSettings.stationSettings.callsign();

                if(self.aprsSettings.stationSettings.ssid
                        && self.aprsSettings.stationSettings.ssid() != null
                        && self.aprsSettings.stationSettings.ssid() != '') {
                    posRpt.callsign = posRpt.callsign + '-' + self.aprsSettings.stationSettings.ssid();
                }

                posRpt.symbolTableId = aprsSettings.stationSettings.stationSymbolTable();
                posRpt.symbolCode = aprsSettings.stationSettings.stationSymbolCode();
                posRpt.destination = self.aprsSettings.AX_25_SOFTWAREVERSION;
                posRpt.digipeaters.push('WIDE2-1');

                posRpt.messageType = '!';

                posRpt.latitude = self.aprsSettings.stationSettings.stationLatitude();
                posRpt.longitude = self.aprsSettings.stationSettings.stationLongitude();

                posRpt.message = 'Testing a new software.';
                
                connectionManager.SendPacket(posRpt);
            }
            
            if(self.sendMessageInterval != null) {
                clearInterval(self.sendMessageInterval);
            }
            
            self.sendMessageInterval = setInterval(self.SendPositionPacket, self.aprsSettings.stationSendPositionInterval(), posRpt);
        } catch(e) {
            console.log(e);
            
            if(self.sendMessageInterval != null) {
                clearInterval(self.sendMessageInterval);
            }
            
            self.sendMessageInterval = setInterval(self.SendPositionPacket, 60000, posRpt);
        }
    };
    
    // DataConnection Form
    self.EditConnection = function(dataConnection) {
        self.dcId(dataConnection.id);
        self.dcConnectionType(dataConnection.connectionType);
        self.dcDescription(dataConnection.description);
        self.dcHost(dataConnection.host);
        self.dcPort(dataConnection.port);
        self.dcFilter(dataConnection.filter);
        self.dcIsEnabled(dataConnection.isEnabled);
        self.dcIsTransmitEnabled(dataConnection.isTransmitEnabled);
        
        $('#dataConnectionEditModal').modal('show');
    };
    
    self.SaveConnection = function() {
        //r/39.2575/-94.6326/500
        var args = {
            'connectionType': self.dcConnectionType()
            , 'description': self.dcDescription()
            , 'host': self.dcHost()
            , 'port': parseInt(self.dcPort())
            , 'filter': self.dcFilter()
            , 'isEnabled': self.dcIsEnabled()
            , 'isTransmitEnabled': self.dcIsTransmitEnabled()
            , 'isReconnectOnFailure': true
            , 'keepAliveTime': 60000
        };
        
        if(self.dcConnectionType == 'AGWPE') {
            args.radioPort = self.dcRadioPort();
        }
        
        if(self.dcId()) {
            args.id = self.dcId();   
            
            connectionManager.UpdateConnection(args);
        } else {
            // TODO: OR UPDATE
            connectionManager.AddConnection(args);   
        }
        
        $('#dataConnectionEditModal').modal('hide');
        
        self.dcId(null);
        self.dcDescription('');
        self.dcConnectionType('APRSIS');
        self.dcHost('');
        self.dcPort(0);
        self.dcFilter('');
        self.dcRadioPort(0);
        self.dcIsEnabled(false);
        self.dcIsTransmitEnabled(false);
    };
    
    self.DeleteConnection = function(connection) {
        // hacks around the backdrop not disappearing when the confirm dialog cloased.
        $('#confirm-delete' + connection.id).modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        
        connectionManager.DeleteConnection(connection);
    };
};

function createMap(baseLayer) {
	map = L.map('map', {
		center: [39, -99]
		, zoom: 5
		, layers: [ baseLayer ]
        , contextmenu: true
        , contextMenuWidth: 140
        , contextmenuItems: [
            {
                text: 'Set my station position to here.'
                , callback: setStationPosition
            }
        ]
	});
	
	try {
		// EPIC FAIL HAPPENS HERE WHEN SERVICE CALLS ARE USED.
		L.control.layers(layerManager.baseLayersGroup(), layerManager.overlaysGroup()).addTo(map);
	} catch(e) {
		console.log(e);
	}
	
	L.control.scale({ position: 'bottomright', imperial: true, metric: true, maxWidth: 300 }).addTo(map);
	
	markersLayer = new L.LayerGroup();	//layer contain searched elements
	map.addLayer(markersLayer);
		
	map.addControl(
		new L.Control.Search({
			layer: markersLayer
			, initial: false
			, markerLocation: true
			, propertyName: 'callsign'
			, markerLocation: false
			, circleLocation: false
			, zoom: 13
		})
	);
};

function setStationPosition(e) {
    if(!viewModel.aprsSettings.stationAutoPosition()) {
        viewModel.aprsSettings.stationLatitude(e.latlng.lat.toFixed(4));
        viewModel.aprsSettings.stationLongitude(e.latlng.lng.toFixed(4));
        
        viewModel.aprsSettings.saveSettings();
    } else {
        // TODO: alert user position cannot be set because they're using auto position.   
    }
};

function readServerData() {
	connectionManager.sentMessages.onValue(function(value) {
		// Debugging purposes - outputs the data to the console.
		console.log(value);
	});
	
	connectionManager.mapPackets.ofType = function(type) {
		return connectionManager.mapPackets.filter(function(data) {
			return data instanceof type
		});
	};
	
	connectionManager.mapPackets.ofType(ObjectReport).onValue(function(data) {
		// TODO: remove the hard coded position marker
		if(data.indicator == '*') { // Live object
			if(data.latitude != null && data.longitude != null) {
				var marker = null;
				
				// check to see if a marker already exists for that station at that coordinates
				var existingMarkers = ko.utils.arrayFilter(viewModel.markers(), function(m) {
					return m.options.callsign == data.name && m.options.symbolTableId == data.symbolTableId && m.options.symbolCode == data.symbolCode
				});
				
				// if a station hasn't moved, we don't need to create 2 markers in the same place... lets be nice to our memory and graphics cards
				// and simply update the marker.  we will remove it from the markers list and add it back at the end.
				// the timer that removes the old markers loops through the markers array until it finds one where the time does not exceed the TIMEOUT_PERIOD period
				if(existingMarkers.length > 0 && existingMarkers[0].getLatLng().lng == data.longitude && existingMarkers[0].getLatLng().lat == data.latitude ) {
					marker = existingMarkers[0];
					
					marker.options.receivedTime = data.receivedTime;
					marker.unbindPopup();
					
					marker.bindPopup('<b>' + data.name + '</b>'
						+ '<br />Callsign: ' + data.callsign
						+ '<br />Received Time: ' + data.receivedTime
						+ '<br />Coordinates (lon/lat): ' + data.longitude + '/' + data.latitude
						+ '<br />Speed: ' + data.speed
						+ '<br />Course: ' + data.direction
						+ '<br />Raw Data: ' + data.rawPacket)
                        + '<br /><a href="javascript:messagesTabClick(\'' + data.callsign + '\')">Send Message</a>'
                        ;
				} else {
					if(existingMarkers.length > 0) {
						var lastMarker = existingMarkers[existingMarkers.length - 1];
						
						lastMarker.unbindLabel();
						lastMarker.setIcon(oldIcon);
						lastMarker.options.angle = 0;
					}
                    
					var marker = new L.APRSPositionMarker(
						[data.latitude, data.longitude]
						, { 
							icon: L.icon({
								iconUrl: '../css/images/station' + stationMarkerIcon.getSymbolPath(data.symbolTableId, data.symbolCode)
							})
							, receivedTime: Date.parse(data.receivedTime)
							, callsign: data.name
							, angle: (data.isIconRotatable == true ? data.direction : 90)
							, symbolTableId: (data.symbolTableId == null ? '' : data.symbolTableId)
							, symbolCode: (data.symbolCode == null ? '' : data.symbolCode)
						}
					).bindPopup('<b>' + data.name + '</b>'
						+ '<br />Callsign: ' + data.callsign
						+ '<br />Received Time: ' + data.receivedTime
						+ '<br />Coordinates (lon/lat): ' + data.longitude + '/' + data.latitude
						+ '<br />Speed: ' + data.speed
						+ '<br />Course: ' + data.direction
						+ '<br />Raw Data: ' + data.rawPacket
                        + '<br /><a href="javascript:messagesTabClick(\'' + data.callsign + '\')">Send Message</a>'
                        )
					.bindLabel(data.name, { noHide: true, direction: 'right' });
					
					marker.addTo(markersLayer);
					viewModel.markers.push(marker);
				}
			}
            
            viewModel.lastStationHeard(data.callsign);
		} else {
			console.log('KILL OBJECT: ' + data.name);
            
            viewModel.markers.remove(function(m) {
                return m.options.name == data.name
            });
		}
	});
	
	connectionManager.mapPackets.ofType(APRSPositionReport).onValue(function(data) {
		// Debugging purposes - outputs the packet to the console.
		//console.log(data);
		
		// TODO: remove the hard coded position marker
		if(data.latitude != null && data.longitude != null) {
			var marker = null;
			
			// check to see if a marker already exists for that station at that coordinates
			var existingMarkers = ko.utils.arrayFilter(viewModel.markers(), function(m) {
				return m.options.callsign == data.callsign && m.options.symbolTableId == data.symbolTableId && m.options.symbolCode == data.symbolCode
			});
			
			// if a station hasn't moved, we don't need to create 2 markers in the same place... lets be nice to our memory and graphics cards
			// and simply update the marker.  we will remove it from the markers list and add it back at the end.
			// the timer that removes the old markers loops through the markers array until it finds one where the time does not exceed the TIMEOUT_PERIOD period
			if(existingMarkers.length > 0 && existingMarkers[0].getLatLng().lng == data.longitude && existingMarkers[0].getLatLng().lat == data.latitude ) {
				marker = existingMarkers[0];
				
				marker.options.receivedTime = data.receivedTime;
				marker.unbindPopup();
				
				marker.bindPopup('<b>' + data.callsign + '</b>'
					+ '<br />Received Time: ' + data.receivedTime
					+ '<br />Coordinates (lon/lat): ' + data.longitude + '/' + data.latitude
					+ '<br />Speed: ' + data.speed
					+ '<br />Course: ' + data.direction
					+ '<br />Raw Data: ' + data.rawPacket)
                    + '<br /><a href="javascript:messagesTabClick(\'' + data.callsign + '\')">Send Message</a>'
                    ;
			} else {
				if(existingMarkers.length > 0) {
					var lastMarker = existingMarkers[existingMarkers.length - 1];
					
					lastMarker.unbindLabel();
					lastMarker.setIcon(oldIcon);
					lastMarker.options.angle = 0;
				}
                
				var marker = new L.APRSPositionMarker(
					[data.latitude, data.longitude]
					, { 
						icon: L.icon({
							iconUrl: '../css/images/station' + stationMarkerIcon.getSymbolPath(data.symbolTableId, data.symbolCode)
						})
						, receivedTime: Date.parse(data.receivedTime)
						, callsign: data.callsign
						, angle: (data.isIconRotatable == true ? data.direction : 90)
						, symbolTableId: (data.symbolTableId == null ? '' : data.symbolTableId)
						, symbolCode: (data.symbolCode == null ? '' : data.symbolCode)
					}
				).bindPopup('<b>' + data.callsign + '</b>'
					+ '<br />Received Time: ' + data.receivedTime
					+ '<br />Coordinates (lon/lat): ' + data.longitude + '/' + data.latitude
					+ '<br />Speed: ' + data.speed
					+ '<br />Course: ' + data.direction
					+ '<br />Raw Data: ' + data.rawPacket
                    + '<br /><a href="javascript:messagesTabClick(\'' + data.callsign + '\')">Send Message</a>'
                    )
				.bindLabel(data.callsign, { noHide: true, direction: 'right' });
				
				/*
				All stations are considered to be moving at this point.
				In the future, we should try to determine if this is a static
				station.  If it is, don't add a polyline for it.
				*/
				
				var stationTrail = ko.utils.arrayFirst(viewModel.trails(), function(t) { 
					return (
						t.callsign == data.callsign
						&& t.symbolTableId == data.symbolTableId
						&& t.symbolCode == data.symbolCode
					);
				});
				
				if(stationTrail != null || stationTrail != undefined) {
					stationTrail.addPoint(L.latLng(data.latitude, data.longitude));
				} else {
					var polyline = L.polyline([L.latLng(data.latitude, data.longitude)], { color: GetRandomTrailColor() });
					
					var trail = new StationTrail(
						{
							callsign: data.callsign
							, symbolTableId: data.symbolTableId
							, symbolCode: data.symbolCode
							, polyline: polyline
						}
					);
					
					viewModel.trails.push(trail);
					
					polyline.addTo(map);
				}
				
				marker.addTo(markersLayer);
				viewModel.markers.push(marker);
			}
		}
        
        viewModel.lastStationHeard(data.callsign);
	});
	
	connectionManager.messages.onValue(function(value) {
        var msgs = null;
        
        if(value.message.toLowerCase().indexOf('ack') != 0) {
            viewModel.messageWindowMessages.push(new MessageObject(value));
            
            // TODO: Create user preferences to turn notifications off, these can get pretty annoying
            $.notify(
                'From: ' + value.callsign
                + '\nTo: ' + value.addressee
                + '\n' + value.message
                , { autoHide: true, autoHideDelay: 15000 });
        } else {
            var msgNum = '';
            
            if(value.message.trim().length > 3) {
                msgNum = value.message.substring(3);
            }
            
            msgs = ko.utils.arrayFilter(viewModel.messageWindowMessages(), function(m) {
                return m.msgNumber() != ''
                        && m.sourceCall().trim().toUpperCase() == value.addressee.trim().toUpperCase()
                        && m.addressee().trim().toUpperCase() == value.callsign.trim().toUpperCase()
                        && m.msgNumber().trim().toUpperCase() == msgNum.trim().toUpperCase()
                        ;
            });
            
            if(msgs && msgs.length > 0) {
                ko.utils.arrayForEach(msgs, function(m) {
                    m.isAcked(true);
                });
            } else {
                viewModel.messageWindowMessages.push(new MessageObject(value));
            }
        }
            
        viewModel.lastStationHeard(value.callsign);
		
		/*
			NWS
			red - warnings
			yellow - watches
			
			check to see if the user's current position is inside the affected area using the given coordinates
		*/
	});
}

/****************** UI SCRIPTS ******************/
/*
 *   Resizes the leaflet map and messages div (the CSS3 vw/vh does not cut the mustard)
 */

function messagesTabClick(sendTo) {
    console.log('messages tab click');
    
    viewModel.messageAddressee(sendTo);
    //$('#messages').trigger("click");
    $('a[href="#messages"]').trigger('click');
}

$(document).keydown(function(e) {
    if (e.which == 123 /*F12*/) {                           
        e.preventDefault();              
        gui.Window.get().showDevTools();

        return true;
    }
});

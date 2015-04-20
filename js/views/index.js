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
    , layerDB = new Datastore({ filename: path.join(require('nw.gui').App.dataPath, 'aprsViewMapDB.db') })
    , layerManager = new LayerManager(layerDB)
    , connectionManager = new APRSConnectionManager(aprsSettings)
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
var mapEle = $('#map');
var statusBar = $('#statusBar');
var messagesEle = $('#messages');
var tabNavBarEle = null; // set when tabs are created
var viewModel = null;

// DOM is already init'd, must create tabs before doing anything with map
$('#tabs').tabs({
    create: function(event, ui) {
        $('body').css('opacity', '1'); // show body after markup has been enhanced
        tabNavBarEle = $('#mainAppTabs');
        resizeDynamicElements();
    },
    beforeActivate: function(event, ui) {
        if (ui.newTab.text() === 'Map') {
            statusBar.show() 
            map._onResize(); // needed in case window is resized in other tabs
        } else {
            statusBar.hide();
        }
    }
});

$(window).on('resize', resizeDynamicElements);

$.when(
    layerManager.LoadMapLayers()
).done(function() {
    createMap(layerManager.baseLayer());

    viewModel = new pageViewModel();
    ko.applyBindings(viewModel);
    
    window.setInterval(viewModel.RemoveOldPositions, 60000);
    
    // Set a mouse listener to update the status bar with the current latitude and longitude.
    // Set a timer to prevent the action event from executing for every pixel the mouse moves
    // this prevents spikes on the processor.
    var latLngUpdateDelay = 8;
    var executionTimer;
    
    map.on('mousemove', function(e) {
        if(executionTimer) {
            clearTimeout(executionTimer);   
        }
        
        executionTimer = setTimeout(function() {
            viewModel.mouseLatLng(e.latlng);    
        }, latLngUpdateDelay);
    });
    
    $.when(
        connectionManager.LoadConnections()
        , readServerData(viewModel)
    ).done(function() {
        //SendPositionPacket();
    });
});

function SendPositionPacket() {
    /*
    connectionManager.SendPacket(posRpt);
    
    if(sendMessageInterval != null) {
        clearInterval(self.sendMessageInterval);
    }
    
    sendMessageInterval = setInterval(SendPositionPacket, 600000, posRpt);
    */
}

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
    
    self.mouseLatLng = ko.observable(L.latLng(39, -99));
    self.lastStationHeard = ko.observable('');
	
	self.messageWindowMessages = ko.observableArray([]);
    self.messageAddressee = ko.observable('');
    self.messageText = ko.observable('');
    self.messageRequireAck = ko.observable('');
    
    self.aprsSettings = aprsSettings;
    self.aprsSettings.reloadSettings();
    
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
        if(self.messageAddressee() != '' && self.messageText() != '' && self.messageText().length < 67) {
            /*
            var msg = new APRSMessage();
            msg.callsign = '';
            msg.destination = 'APZ678';
            msg.addressee = self.messageAddressee().trim();
            msg.messageType = ':';
            msg.message = self.messageText().trim();
            msg.digipeaters.push('WIDE2-1');
            
            connectionManager.SendPacket(msg);
            
            self.messageText('');
            */
        }
    };
};

function createMap(baseLayer) {
	map = L.map('map', {
		center: [39, -99]
		, zoom: 5
		, layers: [ baseLayer ]
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
}

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
								iconUrl: '../css/images/station' + getSymbolPath(data.symbolTableId, data.symbolCode)
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
							iconUrl: '../css/images/station' + getSymbolPath(data.symbolTableId, data.symbolCode)
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

/*
    Resizes the leaflet map and messages div (the CSS3 vw/vh does not cut the mustard)
*/
function resizeDynamicElements() {
    var h = $(window).height() - tabNavBarEle.height() - 10; // ~45px
    var w = $(window).width();
    
    mapEle.height(h).width(w);
    
    messagesEle.height(h - 75);
}

function messagesTabClick(sendTo) {
    viewModel.messageAddressee(sendTo);
    $('#messagesTab').trigger("click");
}
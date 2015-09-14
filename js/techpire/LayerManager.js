var Datastore = require('nedb')
    , path = require('path')
    ;

L.NamedTileLayer = L.TileLayer.extend({
	options: {
		displayName: ''
		, refreshInterval: 0	// in milliseconds - if the value is 0, it should not refresh
	}
});

// TODO: Can this be replaced by leaflet.wms.js?
// https://github.com/heigeo/leaflet.wms
L.TileLayer.NamedWMS = L.TileLayer.WMS.extend({
	options: {
		displayName: ''
		, refreshInterval: 0	// in milliseconds - if the value is 0, it should not refresh
	}
});

L.NamedImageOverlay = L.ImageOverlay.extend({
	options: {
		displayName: ''
		, refreshInterval: 0	// in milliseconds - if the value is 0, it should not refresh
	}
});

// NamedCachedTileLayer is based on: https://github.com/tbicr/OfflineMap/blob/master/leaflet_base64fr_precache_site/map.js#L71
L.NamedCachedTileLayer = L.NamedTileLayer.extend({
    _setUpTile: function (tile, value) {
        tile._layer = this;
        tile.onload = this._tileOnLoad;
        tile.onerror = this._tileOnError;
        tile.src = value;
        
        options: {
            storage: null
        }
        
        this.fire('tileloadstart', {
            tile: tile,
            url: tile.src
        });
    }
    , _loadTile: function (tile, tilePoint) {
        var self = this;
        var db = this.options.storage;
        
        this._adjustTilePoint(tilePoint);
        
        if (this.options.storage) {
            this.options.storage.findOne({ point: self.options.displayName + ',' + tilePoint.z + ',' + tilePoint.x + ',' + tilePoint.y }, function (err, cachedTiles) {
                if(err) {
                    console.log('Error finding tile: ' + err);
                } else if(cachedTiles) {
                    console.log('reading local');
                    
                    self._setUpTile(tile, '' + cachedTiles.v);
                    // TODO:
                    // if the tile is "stale" using the refreshInterval
                    // try to get a new one
                    // if we get a new one
                    // delete the old one
                    // cache the new one
                    // else
                    // use the stale one
                } else {
                    self._setUpTile(tile, self.getTileUrl(tilePoint));
                    saveCachedTile(tile, tilePoint, self.options.storage, self.options.displayName);
                }
            })
        } else {
            console.log("database not found, reading layer from source");
            self._setUpTile(tile, self.getTileUrl(tilePoint));
        }
    }
});

// split out from _loadTile to prevent concurrency issues
function saveCachedTile(tile, tilePoint, storage, layerName) {
    var key = layerName + ',' + tilePoint.z + ',' + tilePoint.x + ',' + tilePoint.y;
    
    var xhr = new XMLHttpRequest();
    
    xhr.open('GET', tile.src, true);
    xhr.responseType = 'blob' || 'text';

    xhr.onload = function(err) {
        if (this.status == 200) {
            var reader = new FileReader();

            reader.onloadend = function(e) {
                var tileRecord = { point: key, v: e.target.result, date: new Date() };

                storage.insert(tileRecord, function(err, newRecord) {
                    if(err) {
                        console.log('Error saving New Tile: ' + err);
                    }
                });
            };

            try {
                reader.readAsDataURL(this.response);
            } catch(e) {
                console.log('Error reading ajax tile response as an image ' + e);
            }
        }
    };

    xhr.send();
};

function LayerManager(cachedTilesDatabase) {
	var self = this;
	
    var db = cachedTilesDatabase;
    
	self.baseLayer = ko.observable();
	self.baseLayers = ko.observableArray([]);
	self.overlays = ko.observableArray([]);
	
	self.baseLayersGroup = ko.computed(function() {
		var retVal = { };
	
		ko.utils.arrayForEach(self.baseLayers(), function(layer) {
			retVal[layer.options.displayName] = layer;
		});
		
		return retVal;
	}, self);
	
	self.overlaysGroup = ko.computed(function() {
		var retVal = { };
		
		ko.utils.arrayForEach(self.overlays(), function(layer) {
			retVal[layer.options.displayName] = layer;
		});
		
		return retVal;
	}, self);
	
	self.ReloadBaseLayers = function() {
        var l = new L.NamedCachedTileLayer(
			'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			, {
				'attribution': '© {y} OpenStreetMap Contributors, CC-BY-SA'
				, 'maxZoom': 18
				, 'reuseTiles': true
				, 'displayName': 'OSM - Cached'
				, 'visible': true
                , 'storage': db
			});
		
		self.baseLayers.push(l);
		self.baseLayer(l);
		
        self.baseLayers.push(new L.NamedTileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			, {
				'attribution': '© {y} OpenStreetMap Contributors, CC-BY-SA'
				, 'maxZoom': 18
				, 'reuseTiles': true
				, 'displayName': 'OSM - Online'
				, 'visible': true
                , 'storage': db
			})
        );
        
		self.baseLayers.push(new L.NamedCachedTileLayer(
			'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
			, {
				'attribution': 'OpenCycleMap - © {y} Andy Allen &amp; OpenStreetMap Contributors, CC-BY-SA'
				, 'maxZoom': 18
				, 'reuseTiles': true
				, 'displayName': 'OpenCycleMap'
				, 'visible': true
                , 'storage': db
			})
		);
		
		self.baseLayers.push(new L.NamedCachedTileLayer(
			'http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png'
			, {
				'attribution': 'OpenCycleMap Transport - © {y} Andy Allen &amp; OpenStreetMap Contributors, CC-BY-SA'
				, 'maxZoom': 18
				, 'reuseTiles': true
				, 'displayName': 'OCM Transport'
				, 'visible': true
                , 'storage': db
			})
		);
		
		self.baseLayers.push(new L.NamedCachedTileLayer(
			'http://{s}.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png'
			, {
				'attribution': 'OpenCycleMap Landscape - © {y} Andy Allen &amp; OpenStreetMap Contributors, CC-BY-SA'
				, 'maxZoom': 18
				, 'reuseTiles': true
				, 'displayName': 'OCM Landscape'
				, 'visible': true
                , 'storage': db
			})
		);
		
		self.baseLayers.push(new L.NamedCachedTileLayer(
			'http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg'
			, {
				'attribution': 'Tiles by <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
				, 'maxZoom': 18
				, 'reuseTiles': true
				, 'displayName': 'MapQuest Sattelite'
				, 'visible': true
				, 'subdomains': '1234'
                , 'storage': db
			})
		);
	};
	
	self.ReloadOverlayLayers = function() {
		self.overlays.push(new L.TileLayer.NamedWMS(
            "http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/obs"
            , {
                displayName: 'NWS Ridge NexRad'
                , layers: 'RAS_RIDGE_NEXRAD'
                , format: 'image/png'
                , transparent: true
                , attribution: "NOAA/NOS nowCOAST"
                , opacity: 0.5
            }
        ));
        
        self.overlays.push(new L.TileLayer.NamedWMS(
            "http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/obs"
            , {
                displayName: 'NWS Infrared Cloud'
                , layers: 'RAS_GOES_I4'
                , format: 'image/png'
                , transparent: true
                , attribution: "NOAA/NWS"
                , opacity: 0.5
            }
        ));
        
        /*
		self.overlays.push(new L.NamedImageOverlay(
			'http://radar.weather.gov/ridge/RadarImg/N0R/EAX_N0R_0.gif'
			, [[41.3440, -97.0287], [36.2668, -91.4900]]
			, {
				displayName: 'NOR'
			}
		));
        
        
        self.overlays.push(new L.TileLayer.NamedWMS(
            "http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/obs"
            , {
                displayName: 'Tornado Warnings'
                , layers: 'WARN_SHORT_TOR'
                , format: 'image/png'
                , transparent: true
                , attribution: "NOAA/NOS nowCOAST"
                , opacity: 0.5
            }
        ));
        
        self.overlays.push(new L.TileLayer.NamedWMS(
            "http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/obs"
            , {
                displayName: 'Severe Thunderstorm Warnings'
                , layers: 'WARN_SHORT_SVR'
                , format: 'image/png'
                , transparent: true
                , attribution: "NOAA/NOS nowCOAST"
                , opacity: 0.5
            }
        ));
        */
	};
	
	self.LoadMapLayers = function() {
		self.ReloadBaseLayers();
		self.ReloadOverlayLayers();
	};
    
    self.ClearMapCache = function() {
        ko.utils.arrayForEach(self.baseLayers(), function(layer) {
            self.ClearLayerCache(layer.options.displayName);
        });
    };
    
    self.ClearLayerCache = function(layerName) {
        db.remove({ 'point': new RegExp('^' + layerName + ',') }, { multi: true }, function(err, numRemoved) {
            console.log('Removed ' + numRemoved + ' layers from the database for layer ' + layerName);
        });
        
        db.persistence.compactDatafile();
    };
}

/*
try {	
	/*
	This will get all the layers before finally adding them to the layers selection.
	We can do this to get around the async behavior of the service calls.  Before anybody
	asks about setting async to false, it crashes the app.
	*
	$.when(
		$.ajax({
			dataType: "json"
			, url: '/wmsOverlays'
			, async: true
			, success: function(data) {
				for(var x = 0; x < data.layers.length; x++) {
					if(data.layers[x].layerType == 'wms') {
						layerManager.overlays.push(new L.TileLayer.NamedWMS(
							data.layers[x].url
							, {
								layers: '0'
								, format: data.layers[x].format
								, transparent: data.layers[x].transparent
								, opacity: data.layers[x].opacity
								, attribution: data.layers[x].attribution
								, displayName: data.layers[x].displayName
							}
						));
					} else if(data.layers[x].layerType == 'img') {
						layerManager.overlays.push(new L.NamedImageOverlay(
							data.layers[x].url
							, data.layers[x].imageBounds
							, { displayName: data.layers[x].displayName }));
					}
				}
			}
		})			
		, $.get('/baseLayers', function(data) {
			for(var x = 0; x < data.layers.length; x++) {
				var l = new L.NamedTileLayer(
					data.layers[x].url
					, {
						attribution: data.layers[x].attribution
						, maxZoom: 18
						, reuseTiles: true
						, displayName: data.layers[x].displayName
						, visible: true
					}
				);
			
				layerManager.baseLayers.push(l);
				
				if(data.layers[x].isSelected == true) {
					baseLayer = l;
				}
			}
		})
	).done(function() {
		createMap(baseLayer);
		
		var viewModel = new pageViewModel();
		ko.applyBindings(viewModel);
		
		window.setInterval(viewModel.RemoveOldPositions, 60000);
		
		readServerData(viewModel);
	});
} catch(e) {
	console.log(e);
}
*/
var Datastore = require('nedb')
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
        this._adjustTilePoint(tilePoint);
        
        var key = tilePoint.z + ',' + tilePoint.x + ',' + tilePoint.y;
        var self = this;
        var tileValue = null;
        
        if (this.options.storage) {
            this.options.storage.findOne({ point: key }, function (err, cachedTiles) {
                if(err) {
                    console.log('Error finding tile: ' + err);   
                } else {
                    tileValue = cachedTiles;
                }
            });
                                      
            if(tileValue) {
                self._setUpTile(tile, tileValue);

                // TODO: 
                // if the tile is "stale"
                //      try to get a new one
                //      if we get a new one
                //          delete the old one
                //          cache the new one
                // else
                //      use the stale one
            } else {
                self._setUpTile(tile, self.getTileUrl(tilePoint));
                
                // store the tile in the database
                try {
                    ajax(tile.src, 'blob', function (response) {
                        var reader = new FileReader();

                        reader.onloadend = function(e) {
                            var tileRecord = { point: key, v: e.target.result, date: new Date() };

                            self.options.storage.insert(tileRecord, function(err, newRecord) {
                                if(err) {
                                   console.log('Error saving New Tile: ' + err);
                                }
                            });
                        };

                        try {
                            reader.readAsDataURL(response);
                        } catch(e) {
                            console.log('Error reading ajax tile response as an image ' + e);
                        }
                    });
                } catch(e) {
                    console.log(e);   
                }
            }
        } else {
            console.log("database not found, reading layer from source");
            self._setUpTile(tile, self.getTileUrl(tilePoint));
        }
    }
});

function ajax(src, responseType, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', src, true);
    xhr.responseType = responseType || 'text';
    
    xhr.onload = function(err) {
        if (this.status == 200) {
            callback(this.response);
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
				, 'displayName': 'OSM'
				, 'visible': true
                , 'storage': db
			});
		
		self.baseLayers.push(l);
		self.baseLayer(l);
		
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
			'http://services.nationalmap.gov/arcgis/services/NEXRAD_Weather/MapServer/WMSServer'
			, {
				layers: '0'
				, format: 'image/png'
				, transparent: true
				, opacity: 0.5
				, attribution: 'USGS <a href="http://nationalmap.gov"><i>The National Map</i></a>'
				, displayName: 'NextRAD - US'
			}
		));
						
		self.overlays.push(new L.NamedImageOverlay(
			'http://radar.weather.gov/ridge/RadarImg/N0R/EAX_N0R_0.gif'
			, [[41.3440, -97.0287], [36.2668, -91.4900]]
			, { 
				displayName: 'NOR'
			}
		));
	};
	
	self.LoadMapLayers = function() {
		self.ReloadBaseLayers();
		self.ReloadOverlayLayers();
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
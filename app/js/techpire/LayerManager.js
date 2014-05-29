L.NamedTileLayer = L.TileLayer.extend({
	options: {
		displayName: ''
		, refreshInterval: 0	// in milliseconds - if the value is 0, it should not refresh
	}
});

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


L.NamedTileLayer = L.TileLayer.extend({
	options: {
		displayName: ''
		, refreshInterval: 0	// in milliseconds - if the value is 0, it should not refresh
	}
});

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

function LayerManager() {
	var self = this;
	
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
		var l = new L.NamedTileLayer(
			'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			, {
				'attribution': '© {y} OpenStreetMap Contributors, CC-BY-SA'
				, 'maxZoom': 18
				, 'reuseTiles': true
				, 'displayName': 'OSM'
				, 'visible': true
			});
		
		self.baseLayers.push(l);
		self.baseLayer(l);
		
		self.baseLayers.push(new L.NamedTileLayer(
			'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
			, {
				'attribution': 'OpenCycleMap - © {y} Andy Allen &amp; OpenStreetMap Contributors, CC-BY-SA'
				, 'maxZoom': 18
				, 'reuseTiles': true
				, 'displayName': 'OpenCycleMap'
				, 'visible': true
			})
		);
		
		self.baseLayers.push(new L.NamedTileLayer(
			'http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png'
			, {
				'attribution': 'OpenCycleMap Transport - © {y} Andy Allen &amp; OpenStreetMap Contributors, CC-BY-SA'
				, 'maxZoom': 18
				, 'reuseTiles': true
				, 'displayName': 'OCM Transport'
				, 'visible': true
			})
		);
		
		self.baseLayers.push(new L.NamedTileLayer(
			'http://{s}.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png'
			, {
				'attribution': 'OpenCycleMap Landscape - © {y} Andy Allen &amp; OpenStreetMap Contributors, CC-BY-SA'
				, 'maxZoom': 18
				, 'reuseTiles': true
				, 'displayName': 'OCM Landscape'
				, 'visible': true
			})
		);
		
		self.baseLayers.push(new L.NamedTileLayer(
			'http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg'
			, {
				'attribution': 'Tiles by <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
				, 'maxZoom': 18
				, 'reuseTiles': true
				, 'displayName': 'MapQuest Sattelite'
				, 'visible': true
				, 'subdomains': '1234'
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
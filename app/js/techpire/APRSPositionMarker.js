L.APRSPositionMarker = L.Marker.extend({
	options: {
		// can we compact this by adding the symbolTableId and symbolCode to the callsign?  What sort of performance implications would this have?
		// the we could simply compare the marker callsign to data.callsign + data.symbolTableId + data.symbolCode
		callsign: ''
		, receivedTime: ''
		, angle: 90 // otherwise everything is on its side
		, symbolTableId: ''
		, symbolCode: ''
	}
	// _setPos was ripped from: https://github.com/bbecquet/Leaflet.PolylineDecorator/blob/master/src/L.RotatedMarker.js
	// It was subsequently modified to meet our icon rotating needs.
	, _setPos: function (pos) {
        L.Marker.prototype._setPos.call(this, pos);
        
        if (L.DomUtil.TRANSFORM) {
			if(this.options.angle <= 180) {
				//rotation = data.direction - 90;
				this._icon.style[L.DomUtil.TRANSFORM] += ' rotate(' + (this.options.angle - 90) + 'deg)';
			} else {
				// If direction > 180, the image will be flipped, which then defaults to 270 degrees.
				// For some odd reason, + causes downward rotation, and - causes upward rotation
				// therefore we have to invert the result. ------ may not be true when converting to javascript
				//rotation = ((data.direction - 270) * -1);
				
				this._icon.style[L.DomUtil.TRANSFORM] += ' rotate(' + (this.options.angle - 270) + 'deg)';
				this._icon.style[L.DomUtil.TRANSFORM] += ' rotateY(180deg)';
			}
        }
		/*
		// NOBODY CARES
		else if(L.Browser.ie) {
            // fallback for IE6, IE7, IE8
            var rad = this.options.angle * L.LatLng.DEG_TO_RAD,
                costheta = Math.cos(rad),
                sintheta = Math.sin(rad);
            this._icon.style.filter += ' progid:DXImageTransform.Microsoft.Matrix(sizingMethod=\'auto expand\', M11=' +
                costheta + ', M12=' + (-sintheta) + ', M21=' + sintheta + ', M22=' + costheta + ')';
        }
		*/
    }
});
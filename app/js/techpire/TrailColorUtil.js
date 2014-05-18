var trailColors = new Array();

trailColors[0] = '#0000FF';
trailColors[1] = '#8A2BE2';
trailColors[2] = '#DC143C';
trailColors[3] = '#00FFFF';
trailColors[4] = '#FF1439';
trailColors[5] = '#00FF00';
trailColors[6] = '#FF0000';
trailColors[7] = '#FFFF00';
trailColors[8] = '#000080';
trailColors[9] = '#7CFC00';

function GetRandomTrailColor() {
	return trailColors[Math.floor((Math.random() * 100) % trailColors.length)];
}
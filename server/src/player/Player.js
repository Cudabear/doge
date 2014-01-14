//game player class
var Player = function(startX, startY){
	var x = startX;
	var y = startY;
	var id;

	return {
		x: x,
		y: y,
		id: id
	}
}

exports.Player = Player;
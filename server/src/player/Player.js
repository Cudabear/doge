//game player class
var Player = function(startX, startY, direction){
	var x = startX;
	var y = startY;
	var id;
	var direction = direction;

	return {
		x: x,
		y: y,
		id: id,
		direction: direction
	}
}

exports.Player = Player;
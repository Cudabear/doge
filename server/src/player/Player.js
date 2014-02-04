//game player class
var Player = function(startX, startY, direction){
	var x = startX;
	var y = startY;
	var id;
	var direction = direction;
	var health = 100;
	var size = 64;

	return {
		x: x,
		y: y,
		id: id,
		direction: direction,
		health: health,
		size: size
	}
}

exports.Player = Player;
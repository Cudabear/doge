//game bullet class
var Bullet = function(startX, startY, direction){
	var x = startX;
	var y = startY;
	var id;
	var direction;
	var owner;

	var update = function(){
		this.x++;
	}

	return {
		x: x,
		y: y,
		id: id,
		update: update,
		direction: direction,
		owner: owner,
	}
}

exports.Bullet = Bullet;
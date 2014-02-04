//game bullet class
var Bullet = function(shootPlayer, startX, startY, direction){
	var x = startX;
	var y = startY;
	var id;
	var direction;
	var owner = shootPlayer;
	var size = 32;

	var update = function(){
		var angle = this.direction;
		var speed = 5;

		var dx = Math.cos(angle)*7;
		var dy = Math.sin(angle)*7;

		this.x += dx;
		this.y += dy;


		this.x++;
	}

	var collide = function(playerC){
		if(playerC.id != this.owner.id){
			playerC.health -= 10;	
		}
	}

	return {
		x: x,
		y: y,
		id: id,
		update: update,
		direction: direction,
		owner: owner,
		collide: collide,
		size: size
	}
}

exports.Bullet = Bullet;
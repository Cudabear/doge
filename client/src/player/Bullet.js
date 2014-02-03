var Bullet = function(gameInstance, id, x, y){
	this.id = id;

	this.sprite = gameInstance.add.sprite(x, y, 'lantern');

	this.setX = function(newX){
		this.sprite.x = newX;
	}

	this.setY = function(newY){
		this.sprite.y = newY;
	}
}
var Player = function(gameInstance, id, x, y){
	this.id = id;

	this.sprite = gameInstance.add.sprite(x, y, 'gremlin');
	this.sprite.anchor.setTo(0.5, 0.5);

	this.setX = function(newX){
		this.sprite.x = newX;
	}

	this.setY = function(newY){
		this.sprite.y = newY;
	}
}
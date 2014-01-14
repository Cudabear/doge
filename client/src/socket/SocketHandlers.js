function setEventHandlers(socket){
	socket.on(CONNECT, onSocketConnected);
	socket.on(DISCONNECT, onSocketDisconnected);
	socket.on(NEW_PLAYER, onNewPlayer);
	socket.on(MOVE_PLAYER, onMovePlayer);
	socket.on(REMOVE_PLAYER, onRemovePlayer);
	socket.on(AUTHORIZE_NEW_PLAYER, onAuthorizeNewPlayer);
}

function onSocketConnected(){
	console.log('connected to socket server');

	requestNewPlayerPos();
}

function onSocketDisconnected(){
	console.log('disconnected from socket server');
}

function onNewPlayer(data){
	console.log("new player connected: "+data.id);

	var newPlayer = new Player(game, data.id, data.x, data.y);

	remotePlayers.push(newPlayer);
}

function onMovePlayer(data){
	var movePlayer = playerById(data.id);

	console.log("Moving player of " + data.id + " to x coord" + data.x);

	if(!movePlayer){
		console.log("Player not found: "+data.id);
		return;
	}

	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
}

function onRemovePlayer(data){
	var removePlayer = playerById(data.id);

	if(!removePlayer){
		console.log("Player not found: "+data.id);
		return;
	};

	remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
}

function onAuthorizeNewPlayer(data){
	console.log('New player successfully authorized')
	localPlayer = new Player(game, data.id, data.x, data.y);
}

function requestNewPlayerPos(){
	console.log('attempting to authorize new player');
	var newPlayer = socket.emit(AUTHORIZE_NEW_PLAYER);

}

function handleInput(){
	if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
		socket.emit(KEY_PRESS, {key: KEY_LEFT});
	}else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
		socket.emit(KEY_PRESS, {key: KEY_RIGHT});
	}

	if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
		socket.emit(KEY_PRESS, {key: KEY_UP});
	}else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
		socket.emit(KEY_PRESS, {key: KEY_DOWN});
	}
}

function playerById(id){
	for(var i = 0; i < remotePlayers.length; i++){
		if(remotePlayers[i].id === id){
			return remotePlayers[i];
		}
	}

	if(id === localPlayer.id){
		return localPlayer;
	}

	return false;
}
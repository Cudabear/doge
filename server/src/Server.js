var util = require('util');
var io = require('socket.io');
var Player = require("./player/Player").Player;
var Bullet = require("./player/Bullet").Bullet;
var msgs = require("./messages/Messages");

var socket; //socket controller
var players; //array of connected players
var bullets; //array of bullets in flight
var bulletId = 0;

function init(){
	players = [];
	bullets = [];

	//listen to port 1338
	socket = io.listen(1338);

	socket.configure(function(){
		//only use websockets
		socket.set('transports', ['websocket']);

		socket.set("log level", 2);
	});

	setEventHandlers();

	//update bullets every 50 ms
	setInterval(function(){
		for(var i = 0; i < bullets.length; i++){
			bullets[i].update();
		}

		sendBulletUpdates();
		sendPlayerUpdates();
	}, 50);
}

function sendBulletUpdates(){
	socket.sockets.emit("bullet update", {bullets: bullets});
}

function sendPlayerUpdates(){
	socket.sockets.emit("player update", {players: players});
}

function setEventHandlers(){
	socket.sockets.on('connection', onSocketConnection);
}

//handle new socket connections
function onSocketConnection(client){
	util.log("New player has connected: "+client.id);

	client.on('disconnect', onClientDisconnect);

	client.on(msgs.MOVE_PLAYER, onMovePlayer);

	client.on('key press', onKeyPress);

	client.on('authorize new player', onAuthorizeNewPlayer);

	client.on('click', onCreateBullet);

	client.on('rotate', onRotate);
}

function onRotate(data){
	var shootPlayer = playerById(this.id);

	if(!shootPlayer){
		util.log("Player not found: "+this.id);
		return;
	}

	shootPlayer.direction = data.direction;
}

function onCreateBullet(){
	var shootPlayer = playerById(this.id);

	if(!shootPlayer){
		util.log("Player not found: "+this.id);
		return;
	}

	var bullet = new Bullet(shootPlayer.x, shootPlayer.y, shootPlayer.direction);
	bullet.id = bulletId++;
	bullets.push(bullet);

	util.log("Player " + shootPlayer.id + " has shot bullet.");
}

function onClientDisconnect(){
	util.log("Player has disconnected: "+this.id);
	util.log(players.length)

	var removePlayer = playerById(this.id);

	if(!removePlayer){
		util.log("Player not found: "+this.id);
		return;
	}

	//remove player
	players.splice(players.indexOf(removePlayer), 1);

	//broadcast removed player to all clients
	this.broadcast.emit("removed player", {id: this.id});
}

function onAuthorizeNewPlayer(){
	var newPlayer = new Player(0, 0, 0);
	newPlayer.id = this.id;

	util.log('Authorizing new player: '+this.id);

	//authorize the new player
	this.emit('authorize new player', {id: newPlayer.id, x: newPlayer.x, y: newPlayer.y})

	//broadcast new player to all clients
	this.broadcast.emit('new player', {id: newPlayer.id, x: newPlayer.x, y: newPlayer.y});

	//send existing players to the new player
	var existingPlayer;
	for(var i = 0; i < players.length; i++){
		existingPlayer = players[i];
		this.emit("new player", {id: existingPlayer.id, x: existingPlayer.x, y: existingPlayer.y});
	}

	//add new player to array
	players.push(newPlayer);
}

function onMovePlayer(data){
	var movePlayer = playerById(this.id);

	if(!movePlayer){
		util.log("Player not found: "+this.id);
		return;
	}

	movePlayer.x = data.x;
	movePlayer.y = data.y;

	//broadcasted updated position to udpated socket clients
	this.emit("move player", {id: movePlayer.id, x: movePlayer.x, y: movePlayer.y});
	this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.x, y: movePlayer.y});
}

function onKeyPress(data){
	var movePlayer = playerById(this.id);

	if(!movePlayer){
		util.log("Player not found: "+this.id);
		return;
	}

	//util.log("movePlayer's x coord: " + movePlayer.x);

	var dx = 0;
	var dy = 0;

	switch(data.key){
		case 0:
			dx = -2;
			break;
		case 1:
			dx = 2;
			break;
		case 2:
			dy = 2;
			break;
		case 3:
			dy = -2;
			break;
	}

	movePlayer.x += dx;
	movePlayer.y += dy;

	this.emit("move player", {id: movePlayer.id, x: movePlayer.x, y: movePlayer.y});
	this.broadcast.emit('move player', {id: movePlayer.id, x: movePlayer.x, y: movePlayer.y});
}

function playerById(id){
	for(var i = 0; i < players.length; i++){
		if(players[i].id === id){
			return players[i];
		}
	}

	return false;
}

//run game
init();
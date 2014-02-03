var WIDTH = 960;
var HEIGHT = 720;

var game;
var bullets;
var socket;
var localPlayer;
var remotePlayers;

window.onload = function(){
	remotePlayers = [];
	bullets = [];

	game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, 'canvas-container', {preload: preload, create: create, update: update, render: render});

	connect();

	setInterval(function(){
		updatePlayerRotation();
	}, 150);
}

function connect(){
	socket = io.connect("http://localhost", {port:1338, transports: ['websocket']});
	setEventHandlers(socket);

}

function preload(){
	game.load.atlasJSONHash('gremlin', 'client/res/img/gremlin.png', 'client/res/anim/gremlin.json');
	game.load.image('lantern', 'client/res/img/lantern.png');
}

function create(){
	game.stage.backgroundColor = "#333333";
	game.world.setBounds(-20000, -20000, 60000, 60000);

	game.input.onDown.add(handleClick, this);
}

function update(){
	handleInput();

	localPlayer.sprite.rotation = game.physics.angleToPointer(localPlayer.sprite);
}

function render(){

}

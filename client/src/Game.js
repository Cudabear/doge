var WIDTH = 960;
var HEIGHT = 720;

var game;
var socket;
var localPlayer;
var remotePlayers;

window.onload = function(){
	remotePlayers = [];

	game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, 'canvas-container', {preload: preload, create: create, update: update, render: render});

	connect();
}

function connect(){
	socket = io.connect("http://155.92.68.82", {port:1338, transports: ['websocket']});
	setEventHandlers(socket);

}

function preload(){
	game.load.atlasJSONHash('gremlin', 'client/res/img/gremlin.png', 'client/res/anim/gremlin.json');
}

function create(){
	game.stage.backgroundColor = "#333333";
	game.world.setBounds(-20000, -20000, 60000, 60000);
}

function update(){
	handleInput();
}

function render(){

}

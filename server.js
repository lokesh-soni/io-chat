var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];

server.listen(process.env.PORT || 3003);
console.log('server running...');

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);



	//Disconnect
	socket.on('disconnect', function(data){
	//if(!socket.username) return;
	users.splice(users.indexOf(socket.username), 1);
	updateUsername();
	connections.splice(connections.indexOf(socket), 1);
	console.log('Disconnected: %s sockets connected', connections.length);

	});

	//send message
	socket.on('send message', function(data){
		io.sockets.emit('new message', {msg: data, user: socket.username});
	});

	// new user
	socket.on('new user', function(data, callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsername();

	});

	function updateUsername(){
		io.sockets.emit('get users', users);
	}

});

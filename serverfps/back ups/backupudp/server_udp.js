var PORT = 8082;
var HOST = '127.0.0.1';
var dgram = require('dgram');
var server = dgram.createSocket('udp4');

var room = {};
var buffer = new Buffer.alloc(4);
var users = [];
var chat = [];

var sockets = [];
// server.addMembership('230.185.192.108'); 

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});

server.on('listening', function() {
  var address = server.address();
 console.log('UDP Server listening on ' + address.address + ':' + address.port);
});

function deleteuser(player_id){
	// console.log(player_id);
	if (room.users.includes(player_id))
		{
		if ((room[player_id].time + 3000) < (new Date()).getTime())
			{
			var index = room.users.indexOf(player_id);
			console.log("removing player: " + users[index] + " of index: " + index); 
			users.splice(index,1);
			delete room[users[index]];
			}
		}
	}

server.on('message', function(message, remote) {
	  // console.log(remote.address);
	  if (!(sockets.includes(remote.address)))
	  {
		 sockets.push(remote.address);  
	  }	  
var size = message.slice(8,11);
var message = message.slice(11,parseInt(size)+11);
var msg = message.toString();
				var json = JSON.parse(msg);
				// console.log(json);
				var name = json.Player.id
				room[name] = json.Player
				if (!(users.includes(json.Player.id)))
				{
					console.log(json.Player.id + " connected to the server");
					users.push(json.Player.id);
				}
				if (!(chat.includes(json.Player.message)))
				{

					chat.push(json.Player.message);
				}
				var room_aux = {}
				for (i=0;i<users.length;i++)
				{
					room_aux[users[i]] = room[users[i]]
				}
				room = room_aux
				room["users"] = users;
				room["message"] = chat;
				for (i=0;i<users.length;i++)
				{
					if (i == 0)
					{
						// console.log(users[0]);
						room[users[0]].host = true;
					}
					else
					{
						room[users[i]].host = false;
					}
				}
				setTimeout(deleteuser, 3000, json.Player.id)
				packet = JSON.stringify(room);
var msg = packet;
var client = dgram.createSocket('udp4');
client.send(msg, 0, msg.length, PORT+1, remote.address, function(err, bytes) {
		if (err) throw err;
		client.close();
	});

});

server.bind(PORT);




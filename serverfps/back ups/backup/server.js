var now = require('performance-now');
var _ = require('underscore');
var packet = 'hello';
var client = this;
var total_players = 0;
var i;
var room = {};
var buffer = new Buffer.alloc(4);
var users = [];
var message = [];
var fs = require('fs');
var net = require('net');
var data;
var sockets = [];

console.log("server initialized");

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});


// creating server
net.createServer(function(socket){ //connectionListener

console.log("socket connected")
sockets.push(socket);
console.log("there are " + sockets.length + " sockets connected");
initiate();

var data_share;

	socket.on('error', function(err){
		// console.log(err.toString());
		var index = sockets.indexOf(socket);
		sockets.splice(index,1);
		deleteuser(index);
	}); 
	
	var size_int = 0;
	var string = "";
	
	socket.on('data', function(data){
		// Cutting the Irelevants Parts of the buffer and converting to Json
		string = data.toString();
		if (string[0] == "{"){
			var fixs = string;
			string = fixs.slice(0,size_int);
		}
		else
		{
			for (i=4;i < data.length;i)
			{
				var size_buff = data.slice(i-4,i);
				size_int = size_buff.readUInt32LE();
				data_processed = data.slice(i,i+size_int);
				i+= size_int + 4;
				string = data_processed.toString();
			}
		}
		
		//verifying if json is valid
			if (IsValidJSONString(string)){
				// manipulating Json Data
				var json = JSON.parse(string);
				var name = json.Player.id
				room[name] = json.Player
				if (!(users.includes(json.Player.id)))
					{
					users.push(json.Player.id);
					}
				if (!(message.includes(json.Player.message)))
					{
					message.push(json.Player.message);
					}
				var room_aux = {}
				for (i=0;i<users.length;i++)
					{
					room_aux[users[i]] = room[users[i]]
					}
				room = room_aux
				room["users"] = users;
				room["message"] = message;
				for (i=0;i<users.length;i++)
					{
						if (i == 0)
						{
						room[users[0]].host = true;
						}
						else
						{
						room[users[i]].host = false;
						}
					}
				packet = JSON.stringify(room);
		  }
      });	  
	
}).listen(8082);

function IsValidJSONString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

// sending data back to all clients
setInterval(function () {

	buffer.writeUInt32LE(packet.length);
	// console.log(packet);
	for (i=0;i<sockets.length;i++)
	{
		sockets[i].write(buffer);
		sockets[i].write(packet);
	}
}, 16);

// deleting user
function deleteuser(index){
	console.log("removing player: " + users[index] + " of index: " + index); 
	users.splice(index,1);
	delete room[users[index]];
	}

function initiate(){
	console.log("client initeaded, total players: " +  sockets.length.toString()); 
	}
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
var player_sockets = {};
var player_servers = {};
var room_aux = {}
var port = process.env.port;
var refresh_rate = process.env.refresh_rate;

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});

initiate();

  net.createServer(function(socket){ //connectionListener
  socket.bufferisnotfull = true;
  sockets.push(socket);
  console.log("player of ip: " + socket.address().address + " was connected to port: " + port );
  socket.on('drain', () => {
      socket.bufferisnotfull = true;
  });

  	socket.on('error', function(err){
        var index = sockets.indexOf(socket);
      if(!(index == -1)){
  		  sockets.splice(index,1);
  		  deleteuser(index);
      }
  	});

  	var size_int = 0;
  	var string = "";

  	socket.on('data', function(data){
  		// Cutting the Irelevants Parts of the buffer and converting to Json
      string = data.toString();
  		if (string[0] == "{"){
  			var fixs = string;
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
          socket.id = json.Player.id;
          room_aux[json.Player.srv_n] = {};
          player_sockets[json.Player.id] = socket;
          player_servers[json.Player.id] = json.Player.srv_n;
  				var name = json.Player.id
  				room[name] = json.Player
  				if (!(users.includes(json.Player.id))){
  				      users.push(json.Player.id);
  				}
  				for (i=0;i<users.length;i++){
            if(player_servers[users[i]] == json.Player.srv_n){
  				      room_aux[json.Player.srv_n][users[i]] = room[users[i]];
                room_aux[json.Player.srv_n][Object.keys(room_aux[json.Player.srv_n])[0]].host = true;
              }
  				}
  				packet = room_aux;
  		  }
      });
  }).listen(port);

function IsValidJSONString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

// sending data back to all clients
setInterval(async function () {
	for (i=0;i<sockets.length;i++)
	{
    if(sockets[i].bufferisnotfull){
      var sock = sockets[i];
      var serv = player_servers[sock.id];
      var pak = packet[serv];
      var send = JSON.stringify(pak);
      try{
        buffer.writeUInt32LE(send.length);
		    player_sockets[sock.id].bufferisnotfull = sock.write(buffer);
		    player_sockets[sock.id].bufferisnotfull = sock.write(send);
      }catch(e){}
    }
	}
}, refresh_rate);

// deleting user
function deleteuser(index){
	console.log("removing player: " + users[index] + " of index: " + index + " from port: " + port);
	users.splice(index,1);
  if(!(room[player_servers[users[index]]] == null)){
   delete room[player_servers[users[index]]][users[index]];
  }
	}

function initiate(){
	console.log("Thread Initialized to port: " + port);
	}

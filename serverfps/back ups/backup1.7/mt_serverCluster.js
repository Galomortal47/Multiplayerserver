const cluster = require('cluster');
var myCache = require('cluster-node-cache')(cluster, {stdTTL: 0.5, checkperiod: 3});
const numCPUs = 1;//require('os').cpus().length;
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
var users_cache = [];
var refresh_rate = 16;

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});

if (cluster.isMaster) {

  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();  }

} else {
  // Workers can share any TCP connection
  myCache.flushAll();
  net.createServer(function(socket){ //connectionListener
  console.log("socket connected")
  socket.bufferisnotfull = true;
  sockets.push(socket);
  console.log("there are " + sockets.length + " sockets connected");
  initiate();

  socket.on('drain', () => {
      socket.bufferisnotfull = true;
  });

  	socket.on('error', function(err){
  		var index = sockets.indexOf(socket);
  		sockets.splice(index,1);
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
          //console.log(json);
          room_aux = {};

          myCache.set(json.Player.id, json.Player);
          socket.id = json.Player.id;
          player_sockets[json.Player.id] = socket;
          player_servers[json.Player.id] = json.Player.srv_n;
  		  }
      });
  }).listen(8082);

  console.log(`Worker ${process.pid} started`);

  setInterval(async function () {
    myCache.keys().then(function(results) {
      myCache.get(results.keys).then(function(results) {
          users_cache = results.value;
      });
    });
    for (i=0;i<Object.keys(users_cache).length;i++){
        users_cache_aux = Object.values(users_cache)[i];
        if(room_aux[users_cache_aux.srv_n] == undefined){
          room_aux[users_cache_aux.srv_n] = {};
        }
        room_aux[users_cache_aux.srv_n][users_cache_aux.id] = users_cache_aux;
        room_aux[users_cache_aux.srv_n][Object.keys(room_aux[users_cache_aux.srv_n])[0]].host = true;
    }
    packet = room_aux;
  }, refresh_rate);

}

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
      //console.log(packet);
      try{
        buffer.writeUInt32LE(send.length);
		    player_sockets[sock.id].bufferisnotfull = sock.write(buffer);
		    player_sockets[sock.id].bufferisnotfull = sock.write(send);
      }catch(e){}
    }
	}
}, refresh_rate);

// deleting user
function initiate(){
	console.log("client initeaded, total players: " +  sockets.length.toString());
	}

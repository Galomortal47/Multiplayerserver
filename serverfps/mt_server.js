const cluster = require('cluster');
const redis = require('./cache.js');
var redis_db = new redis;
var myCache = require('cluster-node-cache')(cluster, {stdTTL: 0.5, checkperiod: 3});
const numCPUs = 16;//require('os').cpus().length;
var packet = 'hello';
var client = this;
var total_players = 0;
let i;
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
var users_cache = [''];
var refresh_rate = 50;
var node_id = process.env.node_id;
var port = process.env.port;

const server_list = require('./server_browse.js');

setInterval(function () {
  server_list.browse_list(sockets.length);
}, 3000);


process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});

if (cluster.isMaster) {

  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 1; i <= numCPUs; i++) {
    env = {
      node_id: i,
      port: 8083 + i -1
    }
    cluster.fork(env);  }

} else {

  redis_db.clean_all_cache();
  myCache.flushAll();
  // Workers can share any TCP connection
  net.createServer(function(socket){ //connectionListener
  socket.bufferisnotfull = true;
  sockets.push(socket);
  initiate();

  socket.on('drain', () => {
      socket.bufferisnotfull = true;
  });

  	socket.on('error', function(err){
  		let index = sockets.indexOf(socket);
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
          room_aux = {};
          socket.id = json.Player.id;
          player_sockets[json.Player.id] = socket;
          player_servers[json.Player.id] = json.Player.srv_n;
          redis_db.set_cache(json.Player.srv_n + ":" + json.Player.id, 1 , JSON.stringify(json.Player));
  		  }
      });
  }).listen(port);

  console.log(`Worker ${process.pid} started on port: ` + port);

  setInterval(async function () {
    var find = "*t" + node_id + ":*";
    users_cache = redis_db.all_cache(find);
    try{for (i=0;i<users_cache.length;i++){
        var users_cache_aux = JSON.parse(users_cache[i]);
        room_aux[users_cache_aux.id] = users_cache_aux;
        room_aux[Object.keys(room_aux)[0]].host = true;
    }}catch(e){}
    packet = room_aux;
    myCache.set("t" + node_id, room_aux);
    room_aux = {};
    users_cache = [];
    users_cache_aux = {};
  }, refresh_rate);

function IsValidJSONString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

var pak;

// sending data back to all clients
setInterval(async function () {
  if(sockets.length > 0){
      myCache.get(Object.values(player_servers)).then(function(results) {
        pak = results.value;
      });
  }
  //console.log(sockets.length);
	for (i=0;i<sockets.length;i++)
	{
    if(sockets[i].bufferisnotfull){
      var sock = sockets[i];
      var serv = player_servers[sock.id];
      var send = JSON.stringify(pak[serv]);
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
}

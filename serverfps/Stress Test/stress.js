var packet = {   "Player":{      "enm_dat":[
],
      "host":false,
      "id":"Player2284",
      "message":"hi",
      "srv_n":"t1",
      "rot_y":-0.916,
      "time":1583288771615,
      "x":4.786,
      "y":1.077,
      "z":-10.148,
      "enm_data": [],
      "dmg_com": {}
},
   "message":[
],
   "operator":"Connected",
   "srv_n":"t1",
   "users":[
]
}

var net = require('net');

var refresh_rate = process.env.refresh_rate;

var HOST = process.env.ip;
var PORT = process.env.port;
var server = process.env.server;

var client = new net.Socket();

//const socket = net.createConnection({port: PORT, host: HOST });

var buffer = new Buffer.alloc(4);

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});

function register_command(player_id){

}

client.connect(PORT, HOST, function() {
  console.log('Client connected to: ' + HOST + ':' + PORT);
  var id = (Math.floor((Math.random() * 10000))).toString();
  console.log(server);
  packet.Player.srv_n = server;
	packet.Player.id = "bot" + id;
  var register = {"login_register":{"password":"23423","username":id},"message":[],"operator":"Register","packet":{},"users":[]}
  final_pac = JSON.stringify(register);
  buffer.writeUInt32LE(final_pac.length);
  client.write(final_pac);
	packet.Player.x = ((Math.random() * 10) -5);
	packet.Player.z = ((Math.random() * 10) -5);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
});

setInterval(function () {
	var d = new Date();
	packet.Player.time = d.getTime()
  if (dir_x)
  {
    packet.Player.x += speed;
  }
  else
  {
    packet.Player.x -= speed;
  }


  if (dir_z)
  {
    packet.Player.z += speed;
  }
  else
  {
    packet.Player.z -= speed;
  }
  //console.log(dir_x + " " + dir_z);
	final_pac = JSON.stringify(packet);
	buffer.writeUInt32LE(final_pac.length);
  client.write(final_pac);
}, refresh_rate);

var speed = 25 * refresh_rate / 10000;
var dir_x = true;
var dir_z = true;

setInterval(function () {
  if ((Math.random() * 2) < 1)
  {
    dir_x = !dir_x;
  }
  if ((Math.random() * 2) < 1)
  {
    dir_z = !dir_z;
  }
}, 2000);

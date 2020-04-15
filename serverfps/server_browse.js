var server_data = {
  operator: 'Server',
  data: {
	  servername: 'STONKS BR',
	  time: 100,
	  port: 8082,
	  ip: '0.0.0.0',
    gamemode: 'deathmatch',
    playercount: 8,
    playermax: 32,
    map: 'dm_desert',
    password: ''
  }
};

var playercount = 0;

var net = require('net');

var refresh_rate = 2000;

var HOST = '127.0.0.1';
var PORT = 8081;

var client = new net.Socket();

var buffer = new Buffer.alloc(4);

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});

client.connect(PORT, HOST, function() {
    console.log('Client connected to: ' + HOST + ':' + PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
});

module.exports = {
  browse_list: function (data) {
    var date = new Date();
    var time = date.getTime();
    server_data.data.time = time;
    server_data.data.playercount = data;
    final_pac = JSON.stringify(server_data);
    buffer.writeUInt32LE(final_pac.length);
    client.write(final_pac);
  }
};

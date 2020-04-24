var server_data = {
  operator: 'Server',
  data: {
	  servername: 'STONKS BR',
	  time: 100,
	  port: 8083,
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

var HOST = '35.198.0.32';
var PORT = 8082;

var client = new net.Socket();

var buffer = new Buffer.alloc(4);

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});

const publicIp = require('public-ip');
var ipv4
var ipv6

(async () => {
	ipv4 = await publicIp.v4();
  console.log(ipv4);
	//=> '46.5.21.123'

	ipv6 = await publicIp.v6();
  console.log(ipv6);
	//=> 'fe80::200:f8ff:fe21:67cf'
})();

module.exports = {
  browse_list: function (data,port) {
    var date = new Date();
    var time = date.getTime();
    server_data.data.ip = ipv4;
    server_data.data.time = time;
    server_data.data.playercount = data;
    server_data.data.port = port;
    final_pac = JSON.stringify(server_data);
    try{
      buffer.writeUInt32LE(final_pac.length);
      client.write(final_pac);
    }catch(e){}
  },
  connect_to_server: function (port,ip) {
    try{
        client.connect(port, ip, function() {
            console.log('Client connected to: ' + ip + ':' + port);
        // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
      });
    }catch(e){}
  }
};

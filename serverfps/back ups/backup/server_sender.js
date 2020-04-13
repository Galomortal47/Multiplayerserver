var now = require('performance-now');
var _ = require('underscore');
var packet = 'hello';
var client = this;
var i;
var buffer = new Buffer.alloc(4);
var fs = require('fs');
var net = require('net');
var data;
var sockets = [];

console.log("server_sender initialized");

process.on('message', (msg) = > {
	sockets = msg;
});

while(true){
	buffer.writeUInt32LE(packet.length);
	for (i=0;i<sockets.length;i++)
	{
		sockets[i].write(buffer);
		sockets[i].write(packet);
	}
}
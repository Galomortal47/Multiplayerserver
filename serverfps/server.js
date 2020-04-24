const cp = require("child_process");

var servers = 4;
var i = 0
var players_current = 0

const server_list = require('./server_browse.js');
const login_manager = require('./login_manager.js');

server_list.connect_to_server(8082, "127.0.0.1")

setInterval(function () {
  server_list.browse_list(players_current,8083);
}, 3000);

setInterval(function () {
	if(i < servers){
		var env = {
			port : 8083 + i,
			refresh_rate: 16
		};
		var p1 = cp.fork("st_server.js", {env:env});
		i += 1;
	}
}, 15);

const cp = require("child_process");
const os = require('os')
const cpuCount = os.cpus().length ;

for(var i=1; i<=cpuCount; i++) {
	var env = {
		 port : 8081+i,
		 node_id : "node_id: " + i,
		 node_count : cpuCount,
		 refresh_rate: 16,
		 max_players: 20,
		 ping_limit: 1000
	 };
	var p1 = cp.fork("server.js",{env:env});
}

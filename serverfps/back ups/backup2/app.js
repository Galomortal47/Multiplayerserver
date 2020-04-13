const cp = require("child_process");
const os = require('os')
const cpuCount = os.cpus().length

for(var i=1; i<=cpuCount; i++) {
	var env = {port : 8000+i};
	var p1 = cp.fork("server.js",{env:env});
	console.log(i);
}

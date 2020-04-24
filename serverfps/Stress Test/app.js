const cp = require("child_process");

var test = 16;
var threads = 4;
var servers_n = 1;
var i = 1

setInterval(function () {
	if(i < test){
		var env = {
			port : 8083 + Math.floor((i)/(test/threads)),
			server:'t'+ (Math.floor(((i*servers_n)-1)/test)+1),
			ip: "35.198.0.32",//"127.0.0.1"
			refresh_rate: 50
		};
		var p1 = cp.fork("stress.js", {env:env});
		i += 1;
	}
}, 50);

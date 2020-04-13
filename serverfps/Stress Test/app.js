const cp = require("child_process");

var test = 20;
var threads = 1;
var servers_n = 4;
var i = 1

setInterval(function () {
	if(i < test){
		var env = {
			port : 8082 + Math.floor((i-1)/(test/threads)),
			server:'t'+ (Math.floor(((i*servers_n)-1)/test)+1),
			ip: "35.198.0.32",//"35.198.0.32"
			refresh_rate: 50
		};
		var p1 = cp.fork("stress.js", {env:env});
		i += 1;
	}
}, 150);

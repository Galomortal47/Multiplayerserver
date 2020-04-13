var now = require('performance-now');
var _ = require('underscore');
var packet = {};
var client = this;
var total_players = 0;
var i;
var room = {};
var buffer = new Buffer.alloc(4);
var users = [];
var message = [];
var users_aux = [];
var fs = require('fs');
var net = require('net');
var data;
var sockets = [];
var save_data = {};
var player_sockets = {};
var player_servers = [];
var database = require("./database.js");
var cache = require("./cache.js");
var db_cache = new cache();
var db = new database();
var port = process.env.port;
var node_id = process.env.node_id;
var node_count = process.env.node_count;
var refresh_rate = 16; //16 for less than 32, 32 for more less than 64 and 48 for up a 96,
// that's all supposing a 3Mbs connection

//atom://teletype/portal/4a12eab2-901b-4b08-ac60-740182ba42a4

var login_data = {
		username: "",
		user_password: "",
		email: "",
		content: {pos_x : 0, pos_z : 0, pos_y : 0}
	}

console.log("server: " + node_id + " was initialized");

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});


// creating server
net.createServer(function(socket){ //connectionListener
db_cache.clean_all_cache()
console.log("socket connected")
sockets.push(socket);
console.log("there are " + sockets.length + " sockets connected");
initiate();

var data_share;

	socket.on('error', function(err){
		console.log(err.toString());
		//delete sockets[socket];
		var index = sockets.indexOf(socket);
		console.log("removing socket of index: " + index);
		if (!(index == -1))
		{
			sockets.splice(index,1);
			delete player_sockets[users[index]];
			//console.log("removing player: " + users[index] + " of index: " + index);
			//users.splice(index,1);
		}

	});

	var size_int = 0;
	var string = "";

	socket.on('data', function(data_recive){
		// Cutting the Irelevants Parts of the buffer and converting to Json
		string = data_recive.toString();
		get_last_packet(string,data_recive,size_int);

		//verifying if json is valid
			if (IsValidJSONString(string)){
				//console.log(string+"\n\n\n");
				var json_data = JSON.parse(string);
				if (json_data.operator == "Register"){
					login_data.username = json_data.login_register.username;
					login_data.user_password = json_data.login_register.password;
					db.create(login_data);
				}
				if (json_data.operator == "Login"){
					var name = json_data.login_register.username;
					var login_operation = db.read({username: name});
					//console.log(login_data);
					if (login_operation[0].user_password == json_data.login_register.password){
						console.log('User Logged in');
						console.log(login_operation[0].content);
						data_to_client(socket,login_operation[0].content);
					}
				}
				if (json_data.operator == "Connected"){
					sync_data(json_data,socket);
				}
		  }
      });
}).listen(port);

function get_last_packet(string,data,size_int){
		if (string[0] == "{"){
			var fixs = string;
			string = fixs.slice(0,size_int);
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
}

setInterval(function process1() {
	create_packet();
	send_data_to_players();
	deleteuser();
}, refresh_rate);



// data syncronization function
function sync_data(json,socket){
				player_servers[json.Player.id] = json.srv_n;
				//console.log(player_servers);
				player_sockets[json.Player.id] = socket;
				if(save_data[json.Player.id]){
					db.update({username: json.Player.id},{content: json.Player});
					//console.log("saved data from: " + json.Player.id);
					save_data[json.Player.id] = false
				}
				json.Player["srv_n"] = json.srv_n;
				var send_to_cache =JSON.stringify(json.Player);
				db_cache.set_cache(json.Player.id,send_to_cache);
				var name = json.Player.id;
				room[name] = json.Player;
				if (!(users.includes(json.Player.id)))	{
					users.push(json.Player.id);
				}
				if (!(message.includes(json.Player.message)))	{
					message.push(json.Player.message);
				}

}

// data being saved to the database every 5 seconds
setInterval(function save_player_data() {
	if(users.length > 0){
		console.log("saving data...");
		for (i=0;i<users.length;i++)
			{
				save_data[users[i]] = true
			}
	}
}, 10000);

function create_packet() {
	if(users.length > 0){
		var users_cache = db_cache.all_cache();
		var room_aux = {};
		var users_tab = [];
			for(i=0;i<users_cache.length;i++)
				{
					var parse = JSON.parse(users_cache[i]);
					if(parse.srv_n == player_servers[parse.id]){
							room_aux[parse.id] = parse;
						users_tab[i] = parse.id;
					}//room_aux[users[i]] = room[users[i]];
				

			room = room_aux;
			room["users"] = users_tab;
			room["message"] = message;
			//console.log(room);
		//	room[users_tab[0]].host = true;
			packet[player_servers[users[i-1]]] = room;

		}
	}
};

function IsValidJSONString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

//data to single client
function data_to_client(socket,send_data){
	console.log("data was send");
	msg_string = JSON.stringify(send_data);
	buffer.writeUInt32LE(msg_string.length);
	socket.write(buffer);
	socket.write(msg_string);
}

function deleteuser(){
	for (i=0;i<users_aux.length;i++)
		{
			//console.log( room[users_aux[i]].id + " : " + (-room[users_aux[i]].time + (new Date()).getTime()));
			if((room[users_aux[i]] == undefined)){
				console.log("removing player: " + users_aux[i] + " of index: " + i);
				db_cache.del_cache(users_aux[i]);
				users_aux.splice(users_aux.indexOf(users_aux[i]), 1);
				users.splice(users.indexOf(users[i]), 1);
			} else	if ((room[users_aux[i]].time + 600) < (new Date()).getTime())
					{
						console.log("removing player: " + users_aux[i] + " of index: " + i);
						db_cache.del_cache(users_aux[i]);
						users_aux.splice(users_aux.indexOf(users_aux[i]), 1);
						users.splice(users.indexOf(users[i]), 1);
						//delete player_sockets[users_aux[i]];
					}
		}
}
// sending data back to all clients
function send_data_to_players() {
	for (i=0;i<users.length;i++)
	{
		var pack;
		pack = JSON.stringify(packet[player_servers[users[i]]]);
		//console.log(pack);
		buffer.writeUInt32LE(pack.length);
			player_sockets[users[i]].write(buffer);
			player_sockets[users[i]].write(pack);
	}
}

function initiate(){
	console.log("client initeaded, total players: " +  sockets.length.toString());
	}

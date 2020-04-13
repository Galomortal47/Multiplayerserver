var now = require('performance-now');
var _ = require('underscore');
var fs = require('fs');
var net = require('net');
var database = require("./database.js");
var cache = require("./cache.js");
var packet = {};
var client = this;
var total_players = 0;
var i;
var room = {};
var users = [];
var message = [];
var users_aux = [];
var data;
var sockets = [];
var save_data = {};
var users_cache = [];
var player_sockets = {};
var player_parties = [];
var player_parties_aux = {};
var user_ping = {};
var ban_list = [];
var player_server_time_disparity = {};
var admin_password ="G6ZXBmEf";
var buffer = new Buffer.alloc(4);
var db_cache = new cache();
var db = new database();
var port = process.env.port;
var max_players = process.env.max_players;
var node_id = process.env.node_id;
var node_count = process.env.node_count;
var ping_limit = process.env.ping_limit;
var refresh_rate = process.env.refresh_rate;

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
//initialized_ban_list()
socket.bufferisnotfull = true;
sockets.push(socket);
play
console.log("player of ip: " + socket.address().address + " was conected to port: " + socket.address().port);

var data_share;

	socket.on('drain', () => {
			socket.bufferisnotfull = true;
	});

	socket.on('error', function(err){
		console.log(err.toString());
		//delete sockets[socket];
		console.log("removing socket of player: " + socket.id);
		delete player_sockets[socket.id];
	});

	var size_int = 0;
	var string = "";

	socket.on('data', function(data_recive){
		// Cutting the Irelevants Parts of the buffer and converting to Json
		string = data_recive.toString();
		//verifying if json is valid
			if (IsValidJSONString(string)){
				//console.log(string+"\n\n\n");
				if((ban_list.includes(socket.address().address))){
						data_to_client(socket,{server_message: "you where banned"});
				}else{
					let json_data = JSON.parse(string);
					register(socket,json_data);
					login(socket,json_data);
					sync_data(json_data,socket);
					admin_autentication(json_data,socket);
					}
		  	}
      });
}).listen(port);

function initialized_ban_list(){
	var ban_data = {};
	ban_data.username = 'ban_list';
	ban_data.content = {ban_list: ban_list};
	ban_data.user_password = admin_password;
	db.create(ban_data);
	var login_operation = db.read({username: 'ban_list'});
	console.log(login_operation);
	ban_list = login_operation.content.ban_list;
}

function admin_autentication(json_data,socket){
	if (json_data.operator == "Admin_command"){
		if (json_data.login_register.username == "Admin"){
			if (json_data.login_register.password == admin_password){
				ban_user(json_data);
			}
		}
	}
}

function ban_user(json_data){
		ban_list.push(player_sockets[json_data.login_register.ban_user].address().address);
		//ban_data = login_data;
		//ban_data.username = 'ban_list';
		//ban_data.password = admin_password;
		//ban_data.content = {ban_list: ban_list};
		//db.update(ban_data);
	}


function login(socket,json_data){
	if (json_data.operator == "Login"){
		var name = json_data.login_register.username;
		var login_operation = db.read({username: name});
		//console.log(login_data);
		if (!(login_operation[0] == undefined)){
			if (login_operation[0].username == name){
				if (login_operation[0].user_password == json_data.login_register.password){
				//console.log('User Logged in');
				//console.log(login_operation[0].content);
					console.log("player: " + name + " recived data from player: " + login_operation[0].username);
					login_operation[0].content.server_message = "Login Succesfully";
					data_to_client(socket,login_operation[0].content);
				//data_to_client(socket,{server_message: "Login Succesfully"});
				}
			}
			else{
				data_to_client(socket,{server_message: "User and password don't match"});
			}
		}else{
			data_to_client(socket,{server_message: "User and password don't match"});
		}
		name = null;
		login_operation = null;
	}
}

function register(socket,json_data){
	if (json_data.operator == "Register"){
		login_data.username = json_data.login_register.username;
		login_data.user_password = json_data.login_register.password;
		var error = db.create(login_data);
		if (error){
			data_to_client(socket,{server_message: "Username Already Taken"});
		}else{
			data_to_client(socket,{server_message: "Registered Succesfully"});
		}
	}
}

function get_last_packet(string,data,size_int){
				var size_buff = data.slice(0,4);
				size_int = size_buff.readUInt32LE();
				data_processed = data.slice(0,size_int);
				return data_processed.toString();
}

setInterval(async function process() {
	create_packet();
	send_data_to_players();
	deleteuser();
}, refresh_rate);

// data syncronization function
function sync_data(json,socket){
	if (json.operator == "Connected"){
				socket.id = json.Player.id;
				player_sockets[json.Player.id] = socket;
				player_parties_aux[json.Player.id] = json.Player.srv_n;
				if (player_server_time_disparity[json.Player.id] == undefined){
					var date = new Date()
					var time = date.getTime();
					player_server_time_disparity[json.Player.id]	= time - json.Player.time;
				}
				if(save_data[json.Player.id]){
					db.update({username: json.Player.id},{content: json.Player});
					save_data[json.Player.id] = false
				}
				var send_to_cache =JSON.stringify(json.Player);
				db_cache.set_cache(json.Player.id,send_to_cache);
				var name = json.Player.id;
				room[name] = json.Player;
				if (!(users.includes(json.Player.id)))	{
					users.push(json.Player.id);
				}
				if (!(player_parties.includes(json.Player.srv_n)))	{
					player_parties.push(json.Player.srv_n);
				}
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
	}, 20000);

function create_packet() {
	try{users_cache = db_cache.all_cache();}catch(e){};
	var room_aux = {};
	users_aux = [];
	for (i=0;i<player_parties.length;i++){
		room_aux[[player_parties[i]]] = {};
	}
	if(!(users_cache == undefined)){
			for (i=0;i<users_cache.length;i++)
			{
				let user_cache_parse = JSON.parse(users_cache[i]);
				if(!(user_cache_parse == null)){
					if(!(room_aux[user_cache_parse.srv_n] == null)){
						user_cache_parse.port = 8082 + Math.floor(i/max_players);
						room_aux[user_cache_parse.srv_n][user_cache_parse.id] = user_cache_parse;
						room_aux[user_cache_parse.srv_n][Object.keys(room_aux[user_cache_parse.srv_n])[0]].host = true;
						user_ping[user_cache_parse.id] = user_cache_parse.time
					}
					users_aux[i] = user_cache_parse.id;
				}
			}
		room = room_aux;
		for (i=0;i<player_parties.length;i++){
			packet[[player_parties[i]]] = JSON.stringify(room[player_parties[i]]);
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
	msg_string = JSON.stringify(send_data);
	console.log(msg_string);
	buffer.writeUInt32LE(msg_string.length);
	socket.write(buffer);
	socket.write(msg_string);
}

function deleteuser(){
	var checker = users_aux;
	var date = new Date()
	var time = date.getTime();
	//console.log();
	for (i=0;i<checker.length;i++){
		try{
			var diff =(time - user_ping[checker[i]]) - player_server_time_disparity;
			if (diff > ping_limit){
					removeuser(checker[i], diff);
			}
		}catch(e){
			//removeuser(checker[i]);
		}
	}
}

function removeuser(user_to_remove,ping){
	console.log("removing player: " + user_to_remove + " of ping: " + ping);
	db_cache.del_cache(user_to_remove);
	if(!(users_aux == undefined)){
		users_aux.splice(user_to_remove, 1);
	}
	users.splice(user_to_remove, 1);
}

// sending data back to all clients
async function send_data_to_players() {
	for (i=0;i<users.length;i++)
		{
			if(!(player_sockets[users[i]] == null)){
				if(player_sockets[users[i]].bufferisnotfull){
					send = packet[player_parties_aux[player_sockets[users[i]].id]];
					buffer.writeUInt32LE(send.length);
					player_sockets[users[i]].bufferisnotfull = player_sockets[users[i]].write(buffer);
					player_sockets[users[i]].bufferisnotfull = player_sockets[users[i]].write(send);
			}
		}
	}
}

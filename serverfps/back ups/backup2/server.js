var now = require('performance-now');
var _ = require('underscore');
var packet = 'hello';
var client = this;
var total_players = 0;
var i;
var room = {};
var buffer = new Buffer.alloc(4);
var users = [];
var message = [];
var fs = require('fs');
var net = require('net');
var data;
var sockets = [];
var database = require("./database.js");
var cache = require("./cache.js");
var db_cache = new cache();
var db = new database();
var port = 8082;//process.env.ENV_VARIABLE;

//node server.js env:8082

//atom://teletype/portal/4a12eab2-901b-4b08-ac60-740182ba42a4

var login_data = {
		username: "",
		user_password: "",
		email: "",
		content: {pos_x : 0, pos_z : 0, pos_y : 0}
	}

console.log("server initialized");

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});


// creating server
net.createServer(function(socket){ //connectionListener

console.log("socket connected")
sockets.push(socket);
console.log("there are " + sockets.length + " sockets connected");
initiate();

var data_share;

	socket.on('error', function(err){
		// console.log(err.toString());
		var index = sockets.indexOf(socket);
		sockets.splice(index,1);
		//deleteuser(index);
	});

	var size_int = 0;
	var string = "";

	socket.on('data', function(data_recive){
		// Cutting the Irelevants Parts of the buffer and converting to Json
		string = data_recive.toString();
		//console.log(string+"\n\n\n");
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
					sync_data(json_data);
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

setInterval(function process() {
	delete_old_messages()
	create_packet()
	send_data_to_players()
}, 16);

var save_data = {};

// data syncronization function
function sync_data(json){
				if(save_data[json.Player.id]){
					db.update({username: json.Player.id},{content: json.Player});
					//console.log("saved data from: " + json.Player.id);
					save_data[json.Player.id] = false
				}
				var send_to_cache =JSON.stringify(json.Player);
				//console.log(send_to_cache);
				db_cache.set_cache(json.Player.id,send_to_cache);
				var name = json.Player.id;
				//room[name] = json.Player;
				if (!(users.includes(json.Player.id)))	{
						users.push(json.Player.id);
					}
				if (!(message.includes(json.Player.message)))	{
						message.push(json.Player.message);
					}
}

var max_message = 50;

function delete_old_messages() {
	if(message.length > max_message){
		message.pop(0);
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
}, 5000);

function create_packet() {
	if(users.length > 0){
		var room_aux = {};
		var users_cache = db_cache.get_cache(users);
		for (i=0;i<users.length;i++)
			{
				room_aux[users[i]] = JSON.parse(users_cache[i]);
			}
		room = room_aux;
		room["users"] = users;
		room["message"] = message;
		room[users[0]].host = true;
		packet = JSON.stringify(room);
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

// sending data back to all clients
function send_data_to_players() {

	buffer.writeUInt32LE(packet.length);
	// console.log(packet);
	for (i=0;i<sockets.length;i++)
	{
		sockets[i].write(buffer);
		sockets[i].write(packet);
	}
}

// deleting user
function deleteuser(index){
	console.log("removing player: " + users[index] + " of index: " + index);
	users.splice(index,1);
	delete room[users[index]];
	}

function initiate(){
	console.log("client initeaded, total players: " +  sockets.length.toString());
	}

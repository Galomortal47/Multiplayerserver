var net = require('net');
var database = require("./database.js");
var admin_password ="G6ZXBmEf";
var buffer = new Buffer.alloc(4);
var db = new database();
var port = 8082;
const redis = require('./cache.js');
var redis_db = new redis;
var ban_list = [];
var server_list = {};

var login_data = {
		username: "",
		user_password: "",
		email: "",
		content: {pos_x : 0, pos_z : 0, pos_y : 0}
	}

console.log("server: was initialized");

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});

// creating server
net.createServer(function(socket){ //connectionListener
//initialized_ban_list()
console.log("player of ip: " + socket.address().address + " was conected to port: " + socket.address().port);

var data_share;

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
					admin_autentication(json_data,socket);
					server_store(socket,json_data);
				}
		  }
    });
}).listen(port);

setInterval(function clean_sever_list() {
	server_list = {};
}, 3000);

function initialized_ban_list(){
	var ban_data = {};
	ban_data.username = 'ban_list';
	ban_data.content = {ban_list: ban_list};
	ban_data.user_password = admin_password;
	db.create(ban_data);
	var login_operation = db.read({username: 'ban_list'});
	ban_list = login_operation.content.ban_list;
}

function server_store(socket,json_data){
	if (json_data.operator == "Server"){
		json_data.data.ip = socket.address().address;
		server_list.server_message = "Server List Arrived";
		var date = new Date();
		var time = date.getTime();
		json_data.data.time = json_data.data.time - time;
		server_list[json_data.data.servername] = json_data.data;
		//console.log(server_list);
	}
	if (json_data.operator == "Server_send"){
		data_to_client(socket,server_list);
		//console.log(server_list);
	}
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
		console.log(db.read({username: name}));
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
	buffer.writeUInt32LE(msg_string.length);
	socket.write(buffer);
	socket.write(msg_string);
}

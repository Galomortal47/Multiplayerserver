extends clsnyctcp

var players={
	"packet" : {},
	"users" : [],
	"message" : []
}
var login_data = {"username" : "", "password" : ""}

var login = false
var message = {}
var start = false
var loged = true

#func _physics_process(delta):
#	print(recive_data)

func _ready():
#	_on_Refresh_server_list_button_down()
	connect = false

func register(username ,password):
	players["operator"] = "Register"
	players["login_register"] = login_data.duplicate()
	players["login_register"].username = username
	players["login_register"].password = password
#	print(players)
	json = players
	print(json)
	send_and_recive_data()


func login(username, password):
	players["operator"] = "Login"
	players["login_register"] = login_data.duplicate()
	players["login_register"].username = username
	players["login_register"].password = password
	json = players
	login = true
	send_and_recive_data()
	print(json)
var users = []

func _physics_process(delta):
	if not recive_data == message and not recive_data == null:
		get_node("/root/singleton").player_data = recive_data
		if recive_data.has("server_message"):
			if recive_data.server_message == "Login Succesfully":
				get_parent().get_node("Login/Join").set_disabled(false) 
				get_parent().get_node("server_message").set_text(recive_data.server_message)
			if recive_data.server_message == "Server List Arrived":
				get_parent().get_node("Server_list/MenuButton").clear()
				users = recive_data.keys().duplicate()
				for i in range(users.size()):
					var x = users[i]
					if not users[i] == 'server_message':
						var y = recive_data[x]
						var ping = y.time
						var spc = "                  "
						var text = x + spc +  y.gamemode + spc + y.map + spc +  str(y.playercount) + " / " +  str(y.playermax) + spc + str(ping)
						print(y)
						get_parent().get_node("Server_list/MenuButton").add_item(text)
		message = recive_data
	if recive_data.has("server_message"):
		get_parent().get_node("server_message").set_text(recive_data.server_message)

func _on_Connect_button_down():
	connect_server()
	_on_Refresh_server_list_button_down()
	pass # Replace with function body.

func _on_MenuButton_item_activated(index):
	var user_index = users[index+1]
	if recive_data.has(user_index):
		var data = recive_data[user_index]
		var ip = data.ipv4
#		ip.erase(0,7)
		get_node("/root/singleton").ip = ip
		get_node("/root/singleton").port = data.port
		get_tree().change_scene(get_parent().main_scene)
	pass # Replace with function body.


func _on_Refresh_server_list_button_down():
	get_parent().get_node("Server_list/MenuButton").show()
	players["operator"] = "Server_send"
	players["login_register"] = login_data.duplicate()
	json = players
	send_and_recive_data()
	pass # Replace with function body.

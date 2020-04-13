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
	connect = false

func register(username ,password):
	players["operator"] = "Register"
	players["login_register"] = login_data.duplicate()
	players["login_register"].username = username
	players["login_register"].password = password
#	print(players)
	json = players
	send_and_recive_data()


func login(username, password):
	players["operator"] = "Login"
	players["login_register"] = login_data.duplicate()
	players["login_register"].username = username
	players["login_register"].password = password
	json = players
	login = true
	send_and_recive_data()

func _physics_process(delta):
#	if start and login and loged:
#		send_and_recive_data()
	if not recive_data == message and not recive_data == null:
		print(recive_data)
		get_node("/root/singleton").player_data = recive_data
		if recive_data.has("server_message"):
			if recive_data.server_message == "Login successfully":
				get_parent().get_node("Login/Join").set_disabled(false) 
				loged = false
		start = true
		
		message = recive_data
	if recive_data.has("server_message"):
		get_parent().get_node("server_message").set_text(recive_data.server_message)

func _on_Connect_button_down():
	connect_server()
	pass # Replace with function body.

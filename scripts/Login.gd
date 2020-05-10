extends Container

var main_scene = "res://TestTCP.tscn"
var save = preload("res://scripts/save.gd").new()

var tcp_udp = true
var data

var username
var ip 
var port 
var password

func _ready():
	get_node('Login').hide()
	get_node('Server').show()
	randomize()
	var id = "Player"+str(int(rand_range(1000,9999)))
	get_node("Login/username_enter").set_text(id)
	data = load_data()
	add_items()
	get_node("Server/ip").set_text(str(data.ips.Default))
	if data.auto_log == "true":
		_on_Connect_button_down()
		_on_Login_button_down()
#	_on_Connect_button_down()
#	get_node('RegisterLogin').connect_server()
	pass # Replace with function body.

func load_data():
	save.loader()
	save.data = save.load_data
	save.save()
	save.loader()
	return save.load_data

func add_items():
	get_node("Server/MenuButton").get_popup().add_item("USA")
	get_node("Server/MenuButton").get_popup().add_item("South America")
	get_node("Server/MenuButton").get_popup().add_item("Local")
	
	get_node("Server/MenuButton").get_popup().connect("id_pressed",self,"_on_item_pressed")

func _on_item_pressed(id):
	var item_name = get_node("Server/MenuButton").get_popup().get_item_text(id)
	var ip_list = ""
	ip_list = data.ips[item_name]
	get_node("Server/ip").set_text(str(ip_list))

func _on_Button2_button_down():
	get_node("Server/ip").set_text("127.0.0.1")
	pass # Replace with function body.

func _on_TCP_button_down():
	if tcp_udp:
		main_scene = "res://TestUDP.tscn"
		get_node("Server/TCP-UDP").set_text("UDP")
		get_node("Server/port").set_text("8082")
		tcp_udp = false
	else:
		main_scene = "res://TestTCP.tscn"
		get_node("Server/TCP-UDP").set_text("TCP")
		get_node("Server/port").set_text("8082")
		tcp_udp = true
	pass # Replace with function body.

func _on_Connect_button_down():
	get_data()
	singleton_data()
	get_node("Server").hide()
	get_node("Login").show()
	pass # Replace with function body.

func singleton_data():
	get_node("/root/singleton").username = get_node("Login/username_enter").get_text()
	get_node("/root/singleton").password = get_node("Login/password_enter").get_text()
	get_node("/root/singleton").ip = get_node("Server/ip").get_text()
	get_node("/root/singleton").port = get_node("Server/port").get_text()

func get_data():
	username = get_node("Login/username_enter").get_text()
	ip = get_node("Server/ip").get_text()
	port = get_node("Server/port").get_text()
	password = get_node("Login/password_enter").get_text()

func _on_Login_button_down():
	get_data()
	get_node("RegisterLogin").login(get_node("Login/username_enter").get_text(), get_node("Login/password_enter").get_text())
	singleton_data()
	pass # Replace with function body.

func _on_Register_button_down():
	get_data()
	get_node("RegisterLogin").register(get_node("Login/username_enter").get_text(), get_node("Login/password_enter").get_text())
	singleton_data()
	pass # Replace with function body.

func _on_Join_button_down():
	get_tree().change_scene(main_scene)
#	singleton_data()
	pass # Replace with function body.

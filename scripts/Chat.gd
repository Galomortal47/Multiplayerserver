extends Container

var chat = []
var sync_path
var ping_record = false
var ping_cache = []
var ping_total = 0
var ping_final = 0
var thread = Thread.new()
var graph = PoolVector2Array()
var graph_size = 10
var graph_spacing = 10
var ping_message_timer = 10
var users
var ping_limit = 1000

func _ready():
	graph.resize(graph_size)
	for x in range(graph_size):
		graph[x] = Vector2(graph_size * graph_spacing,-100)
	sync_path = get_parent().get_node("PlayersSync")
#
func _physics_process(delta):
	if Input.is_action_just_pressed("ui_chat"):
		get_node("Send").grab_focus()
	show_users()
	get_data()
	var camera = sync_path.get_child(0).menu
	get_node("Send").set_readonly(!camera) 
	if Input.is_action_just_pressed("ui_enter"):
		send_data()
		get_node("Send").set_text("")
	
#	pass

func average_ping():
	ping_total = 0
	for i in range(ping_cache.size()):
		ping_total += ping_cache[i] 
	if ping_cache.size() > 0:
		ping_final = ping_total / ping_cache.size()

func get_ping():
	var ping = OS.get_system_time_msecs() - sync_path.get_child(0).time - 34
	if ping < ping_limit:
		get_node("ping").show()
		get_node("diconect").hide()
		get_node("ping").set_text(str("ping: ", int(ping_final))) 
		if ping_cache.size() < ping_message_timer / get_node("Timer").wait_time:
			ping_cache.push_back(ping)
		else:
#			warning(str("the average ping on the past " + str(ping_message_timer) + " secs is: " + str(int(ping_final)) + "ms"))
			ping_cache = []
		average_ping()
		graph()
	else:
		get_node("ping").hide()
		get_node("diconect").show()

func graph():
	get_node("Line2D").set_width(1)
	get_node("Line2D").set_default_color(Color(1,0,0,0.5))
	for x in range(graph_size):
		if not ping_cache.size() <= x and x > 0:
			var var_y = ((ping_cache[ping_cache.size()-1-x]) * 0.1) + 100
			graph[x-1] = Vector2((graph_spacing*(x-1))+10,-var_y)
			graph[x] = Vector2((graph_spacing*x)+10,-var_y)
	get_node("Line2D").set_points(graph)

var anim = 0

var warning_counter = 0
var warnings = []

func warning(var text):
	warnings.append(text)
	get_node("Warning").set_text(warnings[warning_counter])
	get_node("Warning/AnimationPlayer").play("dissapear")
	get_node("Warning/AnimationPlayer").set_speed_scale(warnings.size()-warning_counter) 

func _on_AnimationPlayer_animation_finished(anim_name):
	warning_counter += 1
	if not warnings.size() == warning_counter:
		get_node("Warning/AnimationPlayer").play("dissapear")
	pass # Replace with function body.

func show_users():
	get_node("show_users/MenuButton").clear()
	var sync_node = sync_path
	if not sync_node.recive_data == null:
		users = sync_node.recive_data.keys().duplicate()
		for i in range(users.size()):
			get_node("show_users/MenuButton").add_item(users[i])
		get_node("show_users/TotalPlayers").set_bbcode(str( "Total Players: " + str(users.size())))
		if Input.is_action_pressed("ui_tab"):
			get_node("show_users").show()
		else:
			get_node("show_users").hide()

var data = "test"

func send_data():
	data = str(sync_path.get_child(0).get_name(), ": ", get_node("Send").get_text())
	sync_path.send_message = data

var player_messages = [];

func get_data():
	var t
	for c in range(0,sync_path.recive_message.size()):
		if not player_messages.has(sync_path.recive_message[c]):
			player_messages.append(sync_path.recive_message[c])
	var text = str(player_messages)
	text = text.substr(1,text.length()-2)
	get_node("RichTextLabel").set_text(text)

func _on_Timer_timeout():
	get_ping()
	pass # Replace with function body.

var user_index

func _on_MenuButton_item_activated(index):
	get_node("show_users/MenuButton/Add to Friend").set_text(str("Add " + users[index] + " as Friend"))
	get_node("show_users/MenuButton/Add to Friend").show()
	get_node("show_users/MenuButton/Add to Friend").set_text(str("Ban Player " + users[index]))
	get_node("show_users/MenuButton/Add to Friend").show()
	user_index = users[index]
	pass # Replace with function body.

func _on_Add_to_Friend_button_down():
	warning(str("Friend request was sent to " + user_index))
	get_node("show_users/MenuButton/Add to Friend").hide()
	pass # Replace with function body.

func _on_Ban_User_button_down():
	get_node("commands").ban_command(user_index)
	pass # Replace with function body.

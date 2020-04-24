extends Spatial

var last_port = 8083

func _process(delta):
	var player = get_parent().get_node("PlayersSync").get_child(0)
	var pos = player.get_translation()
	if pos.x > 0 and pos.z > 0:
#		print("t2")
		player.room = "t1"
		change_port(8083)
	elif pos.x < 0 and pos.z < 0:
#		print("t1")
		player.room = "t1"
		change_port(8084)
	elif pos.x < 0 and pos.z > 0:
#		print("t1")
		player.room = "t1"
		change_port(8085)
	elif pos.x > 0 and pos.z < 0:
#		print("t1")
		player.room = "t1"
		change_port(8086)

func change_port(port):
	if not port == last_port:
		last_port = port
		get_node("/root/singleton").port = port
		get_parent().get_node('PlayersSync').packet.disconnect_from_host()

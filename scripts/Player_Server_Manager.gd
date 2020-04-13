extends Spatial

func _process(delta):
	var player = get_parent().get_node("PlayersSync").get_child(0)
	var pos = player.get_translation()
	if pos.x > 0 and pos.z > 0:
#		print("t2")
		player.room = "t1"
	elif pos.x < 0 and pos.z < 0:
#		print("t1")
		player.room = "t2"
	elif pos.x < 0 and pos.z > 0:
#		print("t1")
		player.room = "t3"
	elif pos.x > 0 and pos.z < 0:
#		print("t1")
		player.room = "t4"
	
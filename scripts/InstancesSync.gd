extends Spatial

var recive_data 
var id_aux = [0]

var inst_tp = preload("res://assets/bullet.tscn")

func _physics_process(delta):
	recive_data = get_parent().get_node("PlayersSync").recive_data
	var player = {}
	player["spw_com"] = get_parent().get_node("PlayersSync").get_child(0).spw_com
	if not recive_data == null:
		if recive_data.keys().size() < 1:
			spw_com(player,0)
		for c in range(0,recive_data.keys().size()):
			var player_name2 = recive_data.keys()[c]
			id_aux.resize(recive_data.keys().size())
			spw_com(recive_data[player_name2],c)

func spw_com(var data, var c):
	if data.has("spw_com"):
		if data.spw_com.has(inst_tp) and not data.spw_com.inst_tp == "test":
			var posx = data.spw_com.pos.x
			var posz = data.spw_com.pos.z 
			var posy = data.spw_com.pos.y 
			var motionx = data.spw_com.motion.x 
			var motiony = data.spw_com.motion.y 
			var motionz = data.spw_com.motion.z 
			var amt = data.spw_com.amt 
			var prt_ph = data.spw_com.prt_ph
			var id = data.spw_com.id
			if not id == id_aux[c]:
				for i in range(0,amt):
					var bullet_instance = inst_tp.instance()
					var pos = Vector3(posx,posy,posz)
					bullet_instance.set_translation(pos)
					bullet_instance.prt_ph = prt_ph
					var motion = Vector3(motionx,motiony,motionz)
					bullet_instance.motion = motion
					add_child(bullet_instance)
					id_aux[c] = id
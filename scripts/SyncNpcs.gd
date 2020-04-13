extends Spatial

var smoth = preload("res://scripts/smoothing.gd").new()

var enm_dat = []
var sync_node
var data2 ={
	"x" : 0,
	"y" : 0,
	"z" : 0,
}

func _ready():
	sync_node = get_parent().get_node("PlayersSync")

func _physics_process(delta):
	if not sync_node.recive_data == null:
		if sync_node.recive_data.has(sync_node.id):
			var host = sync_node.recive_data[sync_node.id].host
			if host:
				send_date()
			else:
				sync_npc()
			for i in range(0,get_child_count()):
				get_child(i).main = host

func sync_npc():
	for i in range(0,get_child_count()):
		if sync_node.recive_data[sync_node.recive_data.keys()[0]].enm_dat.size() > 0:
			var recive_data = sync_node.recive_data[sync_node.recive_data.keys()[0]].enm_dat[i]
			var pos = Vector3(recive_data.x,recive_data.y,recive_data.z)
			get_child(i).set_translation(smoth.smoothing(pos,get_child(i).translation))
			var y = smoth.smoothing(recive_data.rot_y,get_child(i).get_node("Mesh").get_rotation().y)
			get_child(i).get_node("Mesh").set_rotation(Vector3(0,y,0))

func send_date():
	enm_dat.resize(get_child_count())
	for i in range(0,get_child_count()):
		enm_dat[i] = data2.duplicate()
		enm_dat[i].x = get_child(i).get_translation().x
		enm_dat[i].z = get_child(i).get_translation().z
		enm_dat[i].y = get_child(i).get_translation().y
		enm_dat[i].rot_y = get_child(i).get_node("Mesh").get_rotation().y

extends clkinematicsync
class_name clobject

var health = 100
var dead = false
var dmg_com = {}
var spw_com = {}

func health():
	if health <= 0:
		dead = true

func damage(var tar, var damage):
	var health_aux = get_node(tar).health
	health_aux -= damage
	dmg_com["tar"] = tar
	dmg_com["health"] = health_aux
	randomize()
	dmg_com["id"] = int(rand_range(0,9999))
	

func username(var node):
	var targert = get_translation() + Vector3(0,1.25,0)
	var pos = get_viewport().get_camera().unproject_position(targert)
	if get_viewport().get_camera().is_position_behind(targert):
		node.hide()
	else:
		node.show()
	node.set_position(pos-Vector2(30,7))

func spawn_instance(var inst_tp, var pos, var motion, var amt,var prt_ph):
	spw_com["inst_tp"] = inst_tp
	spw_com["pos"]["x"] = pos.x
	spw_com["pos"]["z"] = pos.z
	spw_com["pos"]["y"] = pos.y
	spw_com["motion"]["x"] = motion.x
	spw_com["motion"]["y"] = motion.y
	spw_com["motion"]["z"] = motion.z
	spw_com["amt"] = amt
	spw_com["prt_ph"] = prt_ph
	randomize()
	spw_com["id"] = rand_range(0,1)

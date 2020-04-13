extends Spatial

var speed = -50

#func _physics_process(delta):
#	if Input.is_action_just_pressed("ui_shoot") and get_parent().main and not get_parent().dead:
#		var inst_tp = "bullet"
#		var pos = get_parent().get_translation() + Vector3(0,0.6,0)
#		var dir = get_parent().get_node("Camera").get_transform().basis.z
#		var motion = dir * speed
#		var amt = 1
#		get_parent().spawn_instance(inst_tp, pos, motion, amt,get_parent().get_path())
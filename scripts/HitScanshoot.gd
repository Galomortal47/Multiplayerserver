extends Spatial

var speed = -50

func _physics_process(delta):
	if Input.is_action_just_pressed("ui_shoot") and get_parent().main and not get_parent().dead:
		var ray = get_parent().get_node("Camera/weapons/RayCast")
		if ray.is_colliding():
			if ray.get_collider().is_in_group("player") or ray.get_collider().is_in_group("enemies"):
				get_parent().damage(ray.get_collider().get_path(),20)
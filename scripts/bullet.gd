extends KinematicBody

var motion = Vector3()
var prt_ph = ""

func _physics_process(delta):
	motion = move_and_slide(motion)
	get_node("RayCast").set_cast_to(motion* 0.1)
	if $RayCast.is_colliding():
		if $RayCast.get_collider().is_in_group("player") or $RayCast.get_collider().is_in_group("enemies"):
			if not $RayCast.get_collider().get_path() == prt_ph:
				get_node("/root/Test1/Sync").get_child(0).damage($RayCast.get_collider().get_path(),20)
				queue_free()

func _on_Timer_timeout():
	queue_free()
	pass # Replace with function body.

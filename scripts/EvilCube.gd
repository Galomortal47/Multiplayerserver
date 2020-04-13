extends clobject

var move_speed = 3
var grav = Vector3(0,-3,0)

var player = null
var motion = Vector3(0,0,0)
var main = true
var id
var see = false
var sync_path
var raycast

func _ready():
	raycast = $RayCast
	sync_path = get_parent().get_parent().get_node("PlayersSync")
	id = get_node("/root/singleton").username
	add_to_group("enemies")
	
func _physics_process(delta):
	username(get_node("Username"))
	get_node("Username").set_text(str(get_name(),": ",health))
	if main:
		detect_nearest_player()
		if health < 0:
			set_translation(Vector3(0,-1000,0))
			get_node("Username").hide()
		if not player == null:
			if has_node(player):
				var player_node = get_node(player)
				var theta = atan2(player_node.translation.x-self.translation.x,player_node.translation.z-self.translation.z)
				$Mesh.set_rotation(Vector3(0, theta, 0))
				var to_player = player_node.translation - translation
				to_player = to_player.normalized()
				motion = to_player * move_speed * delta
				motion += grav * delta
				motion = move_and_collide(motion)
				$RayCast.look_at(player_node.translation,Vector3(0,1,0))
	attack()

func detect_nearest_player():
	var nplayers = sync_path.get_child_count()
	var distances =[]
	var closest = []
	distances.resize(nplayers)
	closest.resize(nplayers)
	for i in range(0,nplayers):
		var node = sync_path.get_child(i)
		if node.health > 0:
			distances[i] = get_translation().distance_to(node.get_translation())
		else:
			distances[i] = 9999
	var distances_aux = distances.duplicate()
	distances_aux.sort()
	if distances_aux[0] < 10:
		closest = distances.find(distances_aux[0])
		player = sync_path.get_child(closest).get_path()

func attack():
	var raycast = get_node("Mesh/RayCast2")
	if raycast.is_colliding():
		if raycast.get_collider().is_in_group("player"):
			if $Timer.is_stopped(): 
				$Timer.start()

func _on_Timer_timeout():
	var raycast = get_node("Mesh/RayCast2")
	if raycast.is_colliding():
		if raycast.get_collider().is_in_group("player"):
			raycast.get_collider().damage(raycast.get_collider().get_path(), 20)
			raycast.get_collider().hurt()
	pass # Replace with function body.
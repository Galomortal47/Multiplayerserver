extends clobject

var motion = Vector3()
var grav = 0.2 * 60
var speed_aux = 0
var speed = 3
var run_speed = 8
var speed_crouch = 1
var sensitivity_y = 0.15
var sensitivity_x = 0.15
var menu = false
var view = Viewport.new()
var jump = 7
var drag = 0.9
export var main = true
var id = ""
var time = 0
var room = "t2"

func _ready():
	grav /= ProjectSettings.get_setting("physics/common/physics_fps")
#	randomize()
#	var rand_x = rand_range(-5,5)
#	randomize()
#	var rand_z = rand_range(-5,5)
#	set_translation(Vector3(rand_x,0,rand_z))
	$Camera.set_current(main) 

func _physics_process(delta):
	get_node("Username").set_text(str(get_name(), " hp: " ,str(health)))
	username(get_node("Username"))
	get_node("Control/health").set_text(str(health))
	health()
	if main:
		menu()
		set_data()
		if not dead:
			player_controls()
		else:
			respawn()
	dead()
	hide_ui()

func respawn():
	if Input.is_action_just_pressed("ui_accept"):
		health = 100
		set_translation(Vector3(0,0,0))
		dead = false

func menu():
	if Input.is_action_just_pressed("ui_menu") or Input.is_action_just_pressed("ui_chat"):
		menu = !menu
	if menu:
		Input.set_mouse_mode(0)
		if main:
			get_node("Menu").show()
	else:
		Input.set_mouse_mode(2)
		if main:
			get_node("Menu").hide()
#	if not menu:
#		camera()

func hurt():
	if main:
		get_node("Control/AnimationPlayer").play("hurt")

func hide_ui():
	if not main:
		get_node("Control").hide()
	else:
		get_node("Control").show()

func dead():
	if dead:
		get_node("Control/you are dead").show()
		get_node("Control/respawn").show()
	else:
		get_node("Control/you are dead").hide()
		get_node("Control/respawn").hide()

func player_controls():
	if Input.is_action_pressed("ui_run"):
		$Camera.set_translation(Vector3(0,0.6,0))
		speed_aux = run_speed
	elif Input.is_action_pressed("ui_crouch"):
		$Camera.set_translation(Vector3(0,0,0))
		speed_aux = speed_crouch
	else:
		$Camera.set_translation(Vector3(0,0.6,0))
		speed_aux = speed
	if not is_on_floor():
		motion.y -= grav
	if Input.is_action_just_pressed("ui_accept"):
		jump()
	if Input.is_action_pressed("ui_up") and ground():
		move(-1.57)
	if Input.is_action_pressed("ui_right") and ground():
		move(-3.14)
	if Input.is_action_pressed("ui_left") and ground():
		move(0)
	if Input.is_action_pressed("ui_down") and ground():
		move(1.57)
	if ground():
		motion.z *= drag
		motion.x *= drag
	motion = move_and_slide(motion)
	pass # Replace with function body.

func set_data():
	x = get_translation().x
	z = get_translation().z
	y = get_translation().y

func _input(event):
	if not menu and main:
		if event is InputEventMouseMotion:
			$Camera.rotate_y(deg2rad(event.relative.x*-sensitivity_x))
			$MeshInstance.rotate_y(deg2rad(event.relative.x*-sensitivity_x))
			$Camera.rotate_object_local(Vector3(1,0,0),(deg2rad(event.relative.y*-sensitivity_y)))

func move(var rot):
	var move =  Vector3(-cos($Camera.get_rotation().y + rot)*speed_aux,motion.y, sin($Camera.get_rotation().y + rot)*speed_aux)
	motion = move

func jump():
	if ground():
		motion.y += jump

func ground():
	if $RayCast.is_colliding():
		return true
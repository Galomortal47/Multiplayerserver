extends Spatial
class_name clsnycudp

var file = File.new()
var socketUDP = PacketPeerUDP.new()
var i = 0
var data
var string
var recive_data = {
	"x" : 0,
	"y" : 0,
	"z" : 0,
	"time" : 0
}
var json = {}

func _ready():
	print("udp")
#	packet.connect_to_host( "::1", 8082)
	socketUDP.set_dest_address( get_node("/root/singleton").ip, int(get_node("/root/singleton").port) )
	socketUDP.listen(int(get_node("/root/singleton").port)+1, "*")
	print("connected")

func _physics_process(delta):
	if socketUDP.get_available_packet_count() > 0:
		data = (socketUDP.get_packet())
		string = data.get_string_from_ascii()
#		print(string)
		recive_data = parse_json(string)
	var packet = to_json(json)
	socketUDP.put_var(str(str(packet).length(),packet))
#	print(string)

func _exit_tree():
	json["Destroy"] = "true"
	socketUDP.close()
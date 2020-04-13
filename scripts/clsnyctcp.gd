extends Spatial
class_name clsnyctcp

var file = File.new()
var packet = StreamPeerTCP.new()
var i = 0
var data
var string
var recive_data = {}
var json = {}
var connect = true

func connect_server():
	print("tcp")
#	packet.connect_to_host( "::1", 8082)
	packet.connect_to_host( get_node("/root/singleton").ip, int(get_node("/root/singleton").port))
#	packet.set_no_delay(true)
	print("connected")

func send_and_recive_data():
	if not packet.is_connected_to_host():
			packet.connect_to_host( get_node("/root/singleton").ip, int(get_node("/root/singleton").port) )
	var peerstream = PacketPeerStream.new()
	peerstream.set_stream_peer(packet)
	if peerstream.get_available_packet_count() > 0:
		data = (peerstream.get_packet())
		string = data.get_string_from_utf8()
		recive_data = parse_json(string)
#		if not recive_data == null:
#			print(string.length() * 60 * 8 /1000)
	packet.put_string(to_json(json))

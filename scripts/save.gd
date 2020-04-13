extends Node

var file = File.new()
var save = "user://cfg.json"
var data = {"ips" : { "Default" : "35.198.0.32","USA" : "35.226.74.159", "South America" : "35.198.0.32", "Local" : "127.0.0.1"}, "auto_log" : "true", "smooth" : 0.034}
var load_data

func save():
	if file.open(save, File.WRITE) !=0:
		print("erro_write")
		return
	file.store_line(to_json(data))
	file.close()

func loader():
	if file.open(save, File.READ) !=0:
		print("erro_open")
		return
	load_data = parse_json(file.get_line())
	file.close()
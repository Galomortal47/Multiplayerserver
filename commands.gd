extends clsnyctcp

func ban_command(user_index):
	var command 
	command["operator"] = "Ban_User"
	command["login_register"].username = get_node("/root/singleton").username
	command["login_register"].password = get_node("/root/singleton").password
	command["login_register"].ban_user = user_index
	json = command
	send_and_recive_data()
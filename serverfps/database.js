const mongoose = require("mongoose");

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});

mongoose.Promise = global.Promise;

// exception handler
process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});

//connectio to mongodb database
mongoose.connect("mongodb://localhost/game_server_test_4", {
	useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
	console.log("MongoDB had connected");
}).catch((err) => {
	console.log("an error had ocurred: " + err);
});

// schema for the database
const userDataSchema = mongoose.Schema({
	// _id: Number,
	username: {type: String, required: true, index : {unique: true}},
	user_password: {type: String, required: true},
	email: {type: String, required: false},
	content: Object
}, {collection: 'user_Data'});

const serverData = mongoose.Schema({
	// _id: Number,
	severname: {type: String, required: true, index : {unique: true}},
	time: {type: Number, required: true},
	port: {type: Number, required: true},
	ip: {type: Number, required: true},
  gamemode: {type: String, required: false},
  playercount: {type: Number, required: false},
  playermax: {type: Number, required: false},
  map: {type: String, required: false},
  password: {type: String, required: false}
}, {collection: 'server_Data'});

var UserData = mongoose.model('userData', userDataSchema);

//data for testing purporses
var data = {
	//	username: "",
	//	user_password: "",
	//	email: "",
	//	content: {pos_x : 0, pos_z : 0, pos_y : 0}
		}

module.exports = function(){

var error;

// function to create a 'table' on mongodb
 this.create = function(client_data){
	new UserData(
		client_data
	).save(function (err){
		if(err){
			console.log("User Alreadt Exists" + err.toString());
      error = true;
		}
		else{
			console.log("User Registered");
      error = false;
		}
	});
  return error;
  error = null;
}

// function to update the data
 this.update = function(find,change){
	UserData.findOneAndUpdate(
	find,
	change,
	{
		new: true
	}
	).then(doc => {
    // console.log(doc)
  })
  .catch(err => {
    console.error(err)
  })
}

// function to read the data
 this.read = function(find){
	UserData.find(
	find
	, function(err, docs){
		data = docs;//[0].username);
	});
	return data;
}

// function to delete data
 this.data_delete = function(data){
	UserData.findOneAndRemove(
	data
	)
	.then(response =>{
	})
	.catch(err =>{
		console.error(err)
	})
}
};

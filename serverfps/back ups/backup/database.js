const mongoose = require("mongoose");

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});

mongoose.Promise = global.Promise;


mongoose.connect("mongodb://localhost/game_server_test", {
	useNewUrlParser: true, useUnifiedTopology: true 
}).then(() => {
	console.log("MongoDB had connected");
}).catch((err) => {
	console.log("an error had ocurred: " + err);
});

const userDataSchema = mongoose.Schema({
	// _id: Number,
	username: {type: String, required: true},
	user_password: {type: String, required: true},
	email: {type: String, required: true},
	content: Object
}, {collection: 'user_Data'});

var UserData = mongoose.model('userData', userDataSchema);

// new UserData({
	// username: "Galo",
	// user_password: "dbz123",
	// email: "galo@gmail.com",
	// content: {pos_x : 17, pos_z : 21, pos_y : 15}
// }).save();


UserData.findOneAndUpdate(
	{
		username: "Galo"
	},
	{
		content: {pos_x : 27, pos_z : 31, pos_y : 15}
	},
	{
		new: true
	}
	).then(doc => {
    // console.log(doc)
  })
  .catch(err => {
    console.error(err)
  })

UserData.find({
	username: 'Galo'
}, function(err, docs){
	console.log(docs);//[0].username);
});

UserData.findOneAndRemove({
	content: {pos_x : 17, pos_z : 21, pos_y : 15}
})
.then(response =>{
	// console.log(response)
})
.catch(err =>{
	console.error(err)
})

// modules.exports = mongoose.model('Product', productSchema);
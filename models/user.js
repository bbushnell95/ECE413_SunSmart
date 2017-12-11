var db = require("../db");

var userSchema = new db.Schema({
	deviceId: String,
	email: String,
	fullName: String,
	password: String,
	zip: String,
	APIKEY: String
});

var User = db.model("Users", userSchema);

module.exports = User;

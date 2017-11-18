var db = require("../db");

var userSchema = new db.Schema({
	deviceId: String

});

var User = db.model("Users", userSchema);

module.exports = User;

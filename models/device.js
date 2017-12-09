var db = require("../db");

var deviceSchema = new db.Schema({
	deviceId: String,
    userEmail: String,
    apiKey: String
});

var Device = db.model("Device", deviceSchema);

module.exports = Device;

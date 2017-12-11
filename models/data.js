var db = require("../db");

var dataSchema = new db.Schema({
	deviceId: String,
	uvIndex: Number,
	longitude: Number,
	latitude: Number,
	timeStamp: Number //{type: Date, default: Date.now }
});

var Data = db.model("Data", dataSchema);

module.exports = Data;

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost:27017/mongo", { useMongoClient: true });
mongoose.set('debug', true);

module.exports = mongoose;

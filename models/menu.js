var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var menuSchema = new Schema({
    day: Number,
    time: Number,
    name: [String]
});

module.exports = mongoose.model('menu', menuSchema);

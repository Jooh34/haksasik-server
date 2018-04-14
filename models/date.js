var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var dateSchema = new Schema({
    day: Number,
    date: String
});

module.exports = mongoose.model('date', dateSchema);

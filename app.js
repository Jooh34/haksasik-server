var express = require("express"),
    path = require("path"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Timer = require('setinterval'),
    cron = require('node-cron');

var app = express();

var menus = require("./routes/menus");
var dates = require("./routes/dates");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/menus", menus);
app.use("/dates", dates);

// [CONFIGURE SERVER PORT]
var port = process.env.PORT || 8080;

// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

mongoose.connect('mongodb://localhost:27017/start');

// DEFINE MODEL
var Menu = require('./models/menu');
var date = require('./models/date');

// Scheduling Menu-Crawling
var menu = require('./menu/menu');


menu.crawl();

cron.schedule('* */1 * * *', function(){
  console.log('running every hour');
  menu.crawl()
});

// [RUN SERVER]
var server = app.listen(port, function(){
 console.log("Express server has started on port " + port)
});

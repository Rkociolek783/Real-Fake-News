var express = require("express");
var router = express.Router();
var bodyParser = require('body-parser');
var request = require("request");
var cheerio = require("cheerio");
var logger = require('morgan');
var path = require("path");

var {mongoose} = require('./db/mongoose');
var {Article} = require('./models/Article.js');
var {Notes} = require('./models/Note.js');

var app = express();

app.use(express.static(path.join(__dirname, '../public')));


app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

var router = require('../controllers/routeController.js');
app.use('/', router);

app.listen(3000, () => {
    console.log('Started on Port 3000');
});
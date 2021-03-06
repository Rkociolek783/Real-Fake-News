var express = require("express");
var router = express.Router();
var bodyParser = require('body-parser');
var request = require("request");
var cheerio = require("cheerio");
var logger = require('morgan');
var path = require("path");

var {mongoose} = require('./server/db/mongoose');
var {Article} = require('./server/models/Article.js');
var {Notes} = require('./server/models/Note.js');

var app = express();

app.use(express.static(path.join(__dirname, './public')));


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

var router = require('./controllers/routeController.js');
app.use('/', router);

var port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Started on Port 3000');
});
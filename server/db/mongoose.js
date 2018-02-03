var mongoose = require('mongoose');

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/RealFakeNew";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);
mongoose.connect('mongodb://localhost:27017/RealFakeNews');
var db = mongoose.connection;

db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
  });

db.once("open", function() {
   console.log("Mongoose connection successful.");
  });


module.exports = {mongoose};
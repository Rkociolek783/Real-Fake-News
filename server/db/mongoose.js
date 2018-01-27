var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/RealFakeNews');
var db = mongoose.connection;

db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
  });

db.once("open", function() {
   console.log("Mongoose connection successful.");
  });


module.exports = {mongoose};
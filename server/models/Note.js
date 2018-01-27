// Require mongoose
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({

  title: {
    type: String,
    required: true
  },

  body: {
    type: String,
    required: true
  }
});


var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = {Note};
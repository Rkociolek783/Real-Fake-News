var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({

  name: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  }
});


var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = {Note};
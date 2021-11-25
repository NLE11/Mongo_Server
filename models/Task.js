const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dateCreated: { type: String, require: true },
  dateCompleted: { type: String, require: true },
  complete: { type: Boolean, require: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

//Export model
module.exports = mongoose.model("Task", TaskSchema);

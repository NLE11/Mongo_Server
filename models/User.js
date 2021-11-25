const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }], // Define the relationship between user and task
});

//Export model
module.exports = mongoose.model("User", UserSchema); // Export schema

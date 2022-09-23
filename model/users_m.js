const mongoose = require("mongoose");
const users = new mongoose.Schema({
  username: String,
  password: String,
  firstname: String,
  lastname: String,
  age: Number,
  sex: String
});



module.exports = mongoose.model("users", users);

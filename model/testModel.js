const mongoose = require("mongoose");
const test = new mongoose.Schema({
    name : String,
    firstname : String,
    lastname : String
  })

module.exports = mongoose.model("test", test);



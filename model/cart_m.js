const mongoose = require("mongoose");
const Carts = new mongoose.Schema([{data:Object}]);
  // id: String,
  // name: String,
  // price: Number,
  // img: String,
  // qty: Number,
  // total: Number

module.exports = mongoose.model("Carts", Carts);

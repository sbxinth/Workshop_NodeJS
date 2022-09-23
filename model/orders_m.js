const mongoose = require("mongoose");
const Orders = new mongoose.Schema({
  Orders_buyer_name: String,
  Orders_list: Object,
  Orders_total_price: Number,
});

module.exports = mongoose.model("Orders", Orders);

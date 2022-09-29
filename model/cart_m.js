const mongoose = require("mongoose");
const Carts = new mongoose.Schema({
  Carts_buyer_id: mongoose.Types.ObjectId,
  Carts_product_id: mongoose.Types.ObjectId,
});

module.exports = mongoose.model("Carts", Carts);

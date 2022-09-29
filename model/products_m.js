const mongoose = require("mongoose");
const Products = new mongoose.Schema({
  Product_name: String,
  Product_img: String,
  Product_detail: [{ Product_detail_color : String, Product_detail_weight : Number}],
  Product_price: Number,
  Product_amount_in_stock: Number,
});

module.exports = mongoose.model("Products", Products);

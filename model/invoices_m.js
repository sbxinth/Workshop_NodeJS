const mongoose = require("mongoose");
const invoices = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  invoices_buyerName: String,
  invoices_itemList: [{product:{
    _id : mongoose.Types.ObjectId,
    Product_name: String,
    Product_detail: [{ Product_detail_color : String, Product_detail_weight : Number}],
    Product_price: Number}},{Invoice_Amount:Number}],
  invoices_totalPrice : Number
});

module.exports = mongoose.model("invoices", invoices);

const mongoose = require("mongoose");
const invoices = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  invoices_buyerName: String,
  invoices_itemList: [{ type: Object, ref: "Products", required: true },{Invoice_Amount:Number}],
  invoices_totalPrice : Number
});

module.exports = mongoose.model("invoices", invoices);
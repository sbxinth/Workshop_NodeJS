var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const { update } = require("../model/invoices_m");
var InvoiceModel = require("../model/invoices_m");
var productModel = require("../model/products_m");

router.get("/", function (req, res, next) {
  res.send("Welcome to Invoices router :D !");
});

router.get("/GetAllInvoices", async function (req, res, next) {
  try {
    let Invoicesdata = await InvoiceModel.find();
    res.send({
      data: Invoicesdata,
      message: "success to get all Invoices !",
    });
  } catch (error) {
    res.send(error.message);
  }
});

// router.post("/createInvoice", async function (req, res, next) {
//   try {
//     let totalprice = 0;
//     let getBDdata = req.body;
//     console.log(getBDdata,'bd data')

//     /// calculate total price //////
//     let getdataforcal = getBDdata.invoices_itemList;
//     getdataforcal.map((item) => {
//       totalprice += item.product.Product_price;
//     });
//     let new_invoice = new InvoiceModel({
//       _id: mongoose.Types.ObjectId(),
//       invoices_buyerName: getBDdata.invoices_buyerName,
//       invoices_itemList: getBDdata.invoices_itemList,
//       invoices_totalPrice: totalprice,
//     });
//     getdataforcal.map(async (item) => {
//       try {
//         let id = item.product._id;
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//           return console.log({ message: "ID IS INVALID" });
//         }
//         //////////// get product detail ///////////
//         try {
//           let Productdata = await productModel.findById(
//             mongoose.Types.ObjectId(id)
//           );
//           try {
//             if (!mongoose.Types.ObjectId.isValid(Productdata)) {
//               console.log("Product not found !");
//             }
//             let Productz = await productModel.findById(Productdata);
//             let stockProduct = Productz.Product_amount_in_stock;
//             let stockOrder = item.Invoice_Amount;
//             stockProduct = stockProduct - stockOrder;
//             await productModel.updateOne(
//               { _id: mongoose.Types.ObjectId(id) },
//               {
//                 $set: {
//                   Product_amount_in_stock: stockProduct,
//                 },
//               }
//             );
//           } catch (err) {
//             console.log(err, "err");
//           }
//         } catch (error) {
//           console.log(error.message, "error");
//         }
//       } catch (error) {
//         return console.log(error.message, "err");
//       }
//     });
//     let NewInvoice = await new_invoice.save();
//     res.send({
//       buyer_name : NewInvoice.invoices_buyerName,
//       total_price : NewInvoice.invoices_totalPrice,
//       message: "success !",
//       Invoice_Detail: NewInvoice
//     });
//   } catch (error) {
//     res.send(error.message);
//   }
// });

router.post("/createInvoice", async function (req, res, next) {
  try {
    let totalprice = 0;
    let getBDdata = req.body;
    console.log(getBDdata,'bd data')

    /// calculate total price //////
    let getdataforcal = getBDdata.invoices_itemList;
    getdataforcal.map((item) => {
      totalprice += item.product.Product_price;
    });
    let new_invoice = new InvoiceModel({
      _id: mongoose.Types.ObjectId(),
      invoices_buyerName: getBDdata.invoices_buyerName,
      invoices_itemList: getBDdata.invoices_itemList,
      invoices_totalPrice: totalprice,
    });
    getdataforcal.map(async (item) => {
      try {
        let id = item.product._id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return console.log({ message: "ID IS INVALID" });
        }
        //////////// get product detail ///////////
        try {
          let Productdata = await productModel.findById(
            mongoose.Types.ObjectId(id)
          );
          try {
            if (!mongoose.Types.ObjectId.isValid(Productdata)) {
              console.log("Product not found !");
            }
            let Productz = await productModel.findById(Productdata);
            let stockProduct = Productz.Product_amount_in_stock;
            let stockOrder = item.Invoice_Amount;
            stockProduct = stockProduct - stockOrder;
            await productModel.updateOne(
              { _id: mongoose.Types.ObjectId(id) },
              {
                $set: {
                  Product_amount_in_stock: stockProduct,
                },
              }
            );
          } catch (err) {
            console.log(err, "err");
          }
        } catch (error) {
          console.log(error.message, "error");
        }
      } catch (error) {
        return console.log(error.message, "err");
      }
    });
    let NewInvoice = await new_invoice.save();
    res.send({
      buyer_name : NewInvoice.invoices_buyerName,
      total_price : NewInvoice.invoices_totalPrice,
      message: "success !",
      Invoice_Detail: NewInvoice
    });
  } catch (error) {
    res.send(error.message);
  }
});
router.get("/getInvoiceByID/:id", async function (req, res, next) {
  try {
    let Productdata = await InvoiceModel.findById(
      mongoose.Types.ObjectId(req.params.id)
    );
    try {
      if (!mongoose.Types.ObjectId.isValid(Productdata)) {
        res.status(500).send("Product not found !");
      }
      let Productz = await InvoiceModel.findById(Productdata);
      res.status(200).send({ getdat: Productz, message: "OK !" });
    } catch (err) {
      res.status(500).send(err.message);
    }
  } catch (error) {
    console.log(error.message);
  }
});


router.delete("/DeleteInvoiceByInvoiceID/:id", async function (req, res) {
  try {
    let id = req.params.id;
    await InvoiceModel.deleteOne({
      _id: mongoose.Types.ObjectId(id),
    });
    let Invoicez = await InvoiceModel.findById(mongoose.Types.ObjectId(id));
    if (Invoicez) {
      return res.status(500).send({ error: "Still have data !" });
    } else {
      if (!Invoicez){
        return res.status(200).send({
          data: "DATA WAS REMOVED",
          message: "delete success !",
        });
      }else{
        return res.status(200).send({
          data: Invoicez,
          message: "delete not success !",
        });
      }
      

    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
});
module.exports = router;

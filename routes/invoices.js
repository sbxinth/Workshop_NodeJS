var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const { update } = require("../model/invoices_m");
var InvoiceModel = require("../model/invoices_m");
var productModel = require("../model/products_m");

// var testModel = require("../model/testModel");

////////////////// test mongoose ////////////////////////////

// function insertDat(){

// let dataza = new testModel({
//   _id: mongoose.Types.ObjectId(),
//   name : "Sunday",
//   firstname : "rachapol",
//   lastname : "burin"
// });

// let savedat =  dataza.save();

// }

// async function updatedat(){
//   try {
//     // console.log("tesr")
//     await testModel.updateOne(
//       { _id: mongoose.Types.ObjectId("632d9d6866bfa6f5cf9a18d1") },
//       {
//         $set: {
//             name : "The Sun",
//             // firstname : "rachapol",
//             // lastname : "burin"
//         },
//       }
//     );
//     let oo = await testModel.find()
//     console.log({data:oo,message:"ok"})
//   } catch (error) {
//     console.log(error)
//   }
// }
// let x = updatedat()
/////////////////////////////////////////////

// console.log(test());
// async function test() {
//   try {
///////////////// get all /////////////
// let Productdata = await InvoiceModel.find()
// console.log({Productdata,
// message : "succes"})

///------------------dddd

// console.log(Productdata)
// let xxxx = Productdata.map((item)=>{
//     console.log(item)
//     let xz=item._id

//     // console.log(xz,"z")
//     return
// })
// console.log(xxxx[0])
// console.log(xxxx[0].id)

//-------------------dddd
////////////// get by id  //////////////
// let Productdata = await InvoiceModel.findById(mongoose.Types.ObjectId("632d24cdef6c679c4284c79d"))
// try {
//   if (!mongoose.Types.ObjectId.isValid(Productdata)) {
//     console.log("Product not found !")
//   }
//   let Productz = await InvoiceModel.findById(Productdata);
//   console.log({getdat:Productz})
// } catch (error) {
//   console.log(error.message)
// }
//   } catch (error) {
//     console.log(error.message);
//   }
// }

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

// let zza = test();
// async function test() {
//   try {
//     // let getBDdata = req.body;
//     let new_invoice = new InvoiceModel({
//       _id: mongoose.Types.ObjectId(),
//       invoices_buyerName: "Sunday SH",
//       invoices_itemList: [
//         {
//           Product_name: "Iphone12 Pro MAX",
//           Product_detail: [
//             { Product_detail_color: "RED", Product_detail_weight: 1.5 },
//           ],
//           Product_price: 299,
//           Product_amount_in_stock: 100,
//         },
//         { Invoice_Amount: 1 },
//         {
//           Product_name: "Iphone13 Pro MAX",
//           Product_detail: [Array],
//           Product_price: 299,
//           Product_amount_in_stock: 100,
//         },
//         { Invoice_Amount: 1 },
//       ],
//       // invoices_totalPrice:  รอเอามาจาก ข้อมูลใน Item List
//     });

//     // let NewInvoice = await new_invoice.save();
//     console.log({
//       // data: NewInvoice,
//       message: "success !",
//     });
//   } catch (error) {
//     console.log(error.message);
//   }
// }

router.post("/createInvoice", async function (req, res, next) {
  try {
    let totalprice = 0;
    let getBDdata = req.body;

    /// calculate total price //////
    let getdataforcal = getBDdata.invoices_itemList;
    getdataforcal.map((item) => {
      totalprice += item.product.Product_price;
      // console.log(totalprice)
    });
    /////////////////////////////////
    let new_invoice = new InvoiceModel({
      _id: mongoose.Types.ObjectId(),
      invoices_buyerName: getBDdata.invoices_buyerName,
      invoices_itemList: getBDdata.invoices_itemList,
      invoices_totalPrice: totalprice,
    });
    console.log(new_invoice._id, "_id xxx");
    /////// update stock amount //////////
    console.log("oooooo item list ooooooo");
    console.log(getBDdata.invoices_itemList[0]);
    console.log(getBDdata.invoices_itemList[0].product._id);
    console.log("xxxxxx item list xxxxxxx");

    getdataforcal.map(async (item) => {
      // getdataforcal.product._id

      try {
        let id = item.product._id;
        console.log(id, "<------ here");

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
            console.log(Productz.Product_amount_in_stock, "Productz");
            let stockProduct = Productz.Product_amount_in_stock;
            let stockOrder = item.Invoice_Amount;

            // console.log(item.Invoice_Amount,"enddddd")
            stockProduct = stockProduct - stockOrder;
            await productModel.updateOne(
              { _id: mongoose.Types.ObjectId(id) },
              {
                $set: {
                  Product_amount_in_stock: stockProduct,
                },
              }
            );
            console.log("product in stock left -- > ", stockProduct);
            // res.status(200).send({getdat:Productz,message:"OK !"})
          } catch (err) {
            console.log(err, "err");
          }
        } catch (error) {
          console.log(error.message, "error");
        }

        ///////////////////////////////////////
        // if (productModel.findById(id)){

        // }
      } catch (error) {
        return console.log(error.message, "err");
      }
    });

    /////////////////////////////////////

    let NewInvoice = await new_invoice.save();
    res.send({
      data: NewInvoice,
      message: "success !",
    });
  } catch (error) {
    res.send(error.message);
  }
});
router.get("/getProductDataByID/:id", async function (req, res, next) {
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

router.put("/UpdateProductDataByID/:id", async function (req, res, next) {
  try {
    let uid = req.params.id;
    let getBDdata = req.body;
    // console.log(getBDdata)

    await InvoiceModel.updateOne(
      { _id: mongoose.Types.ObjectId(uid) },
      {
        $set: {
          Product_name: getBDdata.Product_name,
          Product_detail: getBDdata.Product_detail,
          Product_price: getBDdata.Product_price,
          Product_amount_in_stock: getBDdata.Product_amount_in_stock,
        },
      }
    );

    let Productdata = await InvoiceModel.findById(mongoose.Types.ObjectId(uid));
    res.status(200).send({
      data: Productdata,
      message: `Update Successful ! for uid = > ${uid}`,
    });
  } catch (error) {
    res.send(error.message);
  }
});

router.delete("/DeleteProductByProductID/:id", async function (req, res) {
  try {
    let id = req.params.id;
    await InvoiceModel.deleteOne({
      _id: mongoose.Types.ObjectId(id),
    });

    let Product = await InvoiceModel.findById(mongoose.Types.ObjectId(id));
    if (Product) {
      return res.status(500).send({ error: "Still have data !" });
    } else {
      return res.status(200).send({
        data: Product,
        message: "delete success !",
      });
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;

var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var ProductModel = require("../model/products_m");

// console.log(test());
// async function test() {
//   try {
    ///////////////// get all /////////////
    // let Productdata = await ProductModel.find()
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
    // let Productdata = await ProductModel.findById(mongoose.Types.ObjectId("632d24cdef6c679c4284c79d"))
    // try {
    //   if (!mongoose.Types.ObjectId.isValid(Productdata)) {
    //     console.log("Product not found !")
    //   }
    //   let Productz = await ProductModel.findById(Productdata);
    //   console.log({getdat:Productz})
    // } catch (error) {
    //   console.log(error.message)
    // }
//   } catch (error) {
//     console.log(error.message);
//   }
// }


router.get("/", function (req, res, next) {
  res.send("Welcome to Product router :D !");
});

router.get("/GetAllProduct", async function (req, res, next) {
  try {
    let Productdata = await ProductModel.find();
    res.send({
      data: Productdata,
      message: "success to get all product !",
    });
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/RegistProduct", async function (req, res, next) {
  try {
    let getBDdata = req.body;
    let new_register = new ProductModel({
        _id : mongoose.Types.ObjectId(),
        Product_name: getBDdata.Product_name,
        Product_detail: getBDdata.Product_detail,
        Product_price: getBDdata.Product_price,
        Product_amount_in_stock: getBDdata.Product_amount_in_stock,
    });
    console.log(new_register._id,"_id xxx")

    let NewProduct = await new_register.save();
    res.send({ data: NewProduct, message: "success !" });
  } catch (error) {
    res.send(error.message);
  }
});
router.get("/getProductDataByID/:id", async function (req, res, next) {
    try {
            let Productdata = await ProductModel.findById(mongoose.Types.ObjectId(req.params.id))
            try {
              if (!mongoose.Types.ObjectId.isValid(Productdata)) {
                res.status(500).send("Product not found !")
                
              }
              let Productz = await ProductModel.findById(Productdata);
              res.status(200).send({getdat:Productz,message:"OK !"})
            } catch (err) {
              res.status(500).send(err.message)
            }

    } catch (error) {
        console.log(error.message)
    }
  });


router.put("/UpdateProductDataByID/:id", async function (req, res, next) {
  try {
    let uid = req.params.id;
    let getBDdata = req.body;
    // console.log(getBDdata)

    await ProductModel.updateOne(
      { _id: mongoose.Types.ObjectId(uid) },
      {
        $set: {
            Product_name: getBDdata.Product_name,
            Product_detail: getBDdata.Product_detail,
            Product_price: getBDdata.Product_price,
            Product_amount_in_stock: getBDdata.Product_amount_in_stock
        }
      }
    );

    let Productdata = await ProductModel.findById(mongoose.Types.ObjectId(uid));
    res.status(200).send({data : Productdata,message:`Update Successful ! for uid = > ${uid}`})
    
  } catch (error) {
    res.send(error.message);
  }
});

router.delete('/DeleteProductByProductID/:id', async function(req,res){

  try {
    let id = req.params.id
    await ProductModel.deleteOne({
      _id : mongoose.Types.ObjectId(id)
    })

    let Product = await ProductModel.findById(mongoose.Types.ObjectId(id))
    if (Product) {
      return res.status(500).send({error:"Still have data !"})
    }else{
      return res.status(200).send({
        data:Product,message:"delete success !"
      })
    }
    
  } catch (error) {
    return res.status(500).send(error.message);
  }
})

module.exports = router;

var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var UserModel = require("../model/users_m");

// console.log(test());
// async function test() {
//   try {
//     ///////////////// get all /////////////
//     // let userdata = await UserModel.find()
//     // console.log({userdata,
//     // message : "succes"})
//     ////////////// get by id  //////////////
//     // let userdata = await UserModel.findById(mongoose.Types.ObjectId("632d24cdef6c679c4284c79d"))
//     // try {
//     //   if (!mongoose.Types.ObjectId.isValid(userdata)) {
//     //     console.log("User not found !")
//     //   }
//     //   let userz = await UserModel.findById(userdata);
//     //   console.log({getdat:userz})
//     // } catch (error) {
//     //   console.log(error.message)
//     // }
//   } catch (error) {
//     console.log(error.message);
//   }
// }

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("Welcome to User router :D !");
});

router.get("/GetUser", async function (req, res, next) {
  try {
    let userdata = await UserModel.find();
    res.send({
      data: userdata,
      message: "success",
    });
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/RegistUser", async function (req, res, next) {
  try {
    let getBDdata = req.body;
    let new_register = new UserModel({
      username: getBDdata.username,
      password: getBDdata.password,
      firstname: getBDdata.firstname,
      lastname: getBDdata.lastname,
      age: getBDdata.age,
      sex: getBDdata.sex,
    });

    let NewUser = await new_register.save();
    res.send({ data: NewUser, message: "success !" });
  } catch (error) {
    res.send(error.message);
  }
});

router.put("/UpdateUserDataByID/:id", async function (req, res, next) {
  try {
    let uid = req.params.id;
    let getBDdata = req.body;

    await UserModel.updateOne(
      { _id: mongoose.Types.ObjectId(uid) },
      {
        $set: {
          username: getBDdata.username,
          password: getBDdata.password,
          firstname: getBDdata.firstname,
          lastname: getBDdata.lastname,
          age: getBDdata.age,
          sex: getBDdata.sex,
        }
      }
    );

    let userdata = await UserModel.findById(mongoose.Types.ObjectId(uid));
    res.status(200).send({data : userdata,message:`Update Successful ! for uid = > ${uid}`})
    
  } catch (error) {
    res.send(error.message);
  }
});

router.delete('/DeleteUserByUserID/:id', async function(req,res){

  try {
    let id = req.params.id
    await UserModel.deleteOne({
      _id : mongoose.Types.ObjectId(id)
    })

    let User = await UserModel.findById(mongoose.Types.ObjectId(id))
    if (User) {
      return res.status(500).send({error:"Still have data !"})
    }else{
      return res.status(200).send({
        data:User,message:"delete success !"
      })
    }
    
  } catch (error) {
    return res.status(500).send(error.message);
  }
})

module.exports = router;

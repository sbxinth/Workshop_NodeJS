var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var productsRouter = require("./routes/products");
var invoicesRouter = require("./routes/invoices");
var cors = require('cors')
var app = express();
var CartModel = require("./model/cart_m");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cors())
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// database connection //
require("dotenv").config();
const { DB_HOST, DB_NAME, DB_PORT } = process.env;

var mongoose = require("mongoose");

mongoose
  .connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`)
  .then(() => {
    console.log("connect success !");
  })
  .catch((err) => {
    console.log(err.message);
  });
/////////////////////////
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/invoices", invoicesRouter);

// cart add data 
app.post('/addCart',async function(req, res, next) {
  let dataBD = req.body
  try {
    let New_Cart = new CartModel({
      data:dataBD
    })
    let Newdata = await New_Cart.save()
    res.status(200).send({
      data: Newdata,
      message: 'success'
    })
  } catch (error) {
    res.send(error.message);
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

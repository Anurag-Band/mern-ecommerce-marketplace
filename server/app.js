const express = require("express");
require("dotenv").config();
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// regular middleware
app.use(express.json());
app.use(
  express.urlencoded({ extended: true, parameterLimit: 100000, limit: "500mb" })
);

//  middleware for getting ERROR response as JSON insted of HTML...
const jsonErrorHandler = (err, req, res, next) => {
  res.send({ status: err.status, error: err.message });
};

// cookies and file middleware
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

//morgan middleware
app.use(morgan("tiny"));

// import all routes here
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const paymentRoute = require("./routes/paymentRoute");
const orderRoute = require("./routes/orderRoute");
const cartRoute = require("./routes/cartRoute");

//  router middleware
app.use("/api/v1", userRoute);
app.use("/api/v1", productRoute);
app.use("/api/v1", paymentRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", cartRoute);

// JSON middleware
app.use(jsonErrorHandler);

// exporting app for index.js
module.exports = app;

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const app = require("./app");
const ConnectWithDb = require("./config/db");
const cloudinary = require("cloudinary");

// To connect with Mongodb database
ConnectWithDb();

// cloudinary config goes here
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

// listening app on PORT
app.listen(process.env.PORT || 5001, () =>
  console.log(`Server is Running at PORT : ${process.env.PORT || 5001}`)
);

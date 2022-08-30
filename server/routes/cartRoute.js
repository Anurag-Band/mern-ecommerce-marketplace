const express = require("express");
const router = express.Router();

const {
  getSingleUserCart,
  addToCart,
  removeFromCart,
  decreaseCartItemQuantity,
} = require("../controllers/cartController");

const { isUserLoggedIn } = require("../middlewares/userMiddleware");

// user Routes
router
  .route("/cart")
  .get(isUserLoggedIn, getSingleUserCart)
  .post(isUserLoggedIn, addToCart)
  .put(isUserLoggedIn, decreaseCartItemQuantity)
  .delete(isUserLoggedIn, removeFromCart);

module.exports = router;

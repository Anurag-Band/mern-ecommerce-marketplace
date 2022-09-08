const express = require("express");
const router = express.Router();

const {
  adminGetAllProducts,
  getAllProducts,
  getOneProduct,
  adminAddProduct,
  adminUpdateOneProduct,
  adminDeleteOneProduct,
  addReview,
  deleteReview,
  getOnlyReviewsForOneProduct,
  adminGetProductReviews,
  adminGetAllReviews,
} = require("../controllers/productController");

const { isUserLoggedIn, customRole } = require("../middlewares/userMiddleware");

// user Routes
router.route("/products").get(getAllProducts);
router.route("/product/:id").get(getOneProduct);
router
  .route("/reviews")
  .get(getOnlyReviewsForOneProduct)
  .delete(isUserLoggedIn, deleteReview);

router
  .route("/review")
  .get(isUserLoggedIn, customRole("admin"), adminGetProductReviews)
  .put(isUserLoggedIn, addReview);

// Admin ONLY Routes
router
  .route("/admin/product/new")
  .post(isUserLoggedIn, customRole("admin"), adminAddProduct);

router
  .route("/admin/products")
  .get(isUserLoggedIn, customRole("admin"), adminGetAllProducts);

router
  .route("/admin/product/:id")
  .put(isUserLoggedIn, customRole("admin"), adminUpdateOneProduct)
  .delete(isUserLoggedIn, customRole("admin"), adminDeleteOneProduct);

module.exports = router;

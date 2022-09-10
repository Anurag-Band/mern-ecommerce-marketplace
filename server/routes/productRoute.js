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
  userDeleteReview,
  getOnlyReviewsForOneProduct,
  adminGetProductReviews,
  adminDeleteReview,
} = require("../controllers/productController");

const { isUserLoggedIn, customRole } = require("../middlewares/userMiddleware");

// user Routes
router.route("/products").get(getAllProducts);
router.route("/product/:id").get(getOneProduct);
router.route("/reviews").get(getOnlyReviewsForOneProduct);

router
  .route("/review")
  .put(isUserLoggedIn, addReview)
  .delete(isUserLoggedIn, userDeleteReview);

// Admin ONLY Routes
router
  .route("/admin/reviews")
  .get(isUserLoggedIn, customRole("admin"), adminGetProductReviews);

router
  .route("/admin/review")
  .delete(isUserLoggedIn, customRole("admin"), adminDeleteReview);

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

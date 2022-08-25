const Product = require("../models/productModel");
const BigPromise = require("../middlewares/BigPromise");
const CustomError = require("../utils/customError");
const cloudinary = require("cloudinary");
const WhereClause = require("../utils/whereClause");

// Product controllers
exports.getAllProducts = BigPromise(async (req, res, next) => {
  const resultPerPage = 8;
  const totalProductsCount = await Product.countDocuments();

  const productsObj = new WhereClause(Product.find(), req.query)
    .search()
    .filter();

  let products = await productsObj.base;
  const filteredProductsCount = products.length;

  productsObj.pager(resultPerPage);
  products = await productsObj.base.clone();

  res.status(200).json({
    success: true,
    products,
    resultPerPage,
    filteredProductsCount,
    totalProductsCount,
  });
});

exports.getOneProduct = BigPromise(async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(
        new CustomError("No Products Found related to the ID!!!", 404)
      );
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.addReview = BigPromise(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const product = await Product.findById(productId);

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const isUserAlreadyReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isUserAlreadyReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

exports.deleteReview = BigPromise(async (req, res, next) => {
  const { productId } = req.query;

  const product = await Product.findById(productId);

  if (!product) {
    return next(new CustomError("Product not Found", 404));
  }

  const reviews = product.reviews.filter(
    (review) => review.user.toString() !== req.user._id.toString()
  );

  // adjust ratings
  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }
  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Review is Deleted Successfully!!!",
  });
});

exports.getOnlyReviewsForOneProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.query.id).populate(
    "reviews.user",
    "photo"
  );

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// admin ONLY controllers
exports.adminAddProduct = BigPromise(async (req, res, next) => {
  const imageArray = [];

  if (!req.files) {
    return next(new CustomError("Product Images are Required!!!", 401));
  }

  if (req.files) {
    for (let i = 0; i < req.files.photos.length; i++) {
      let result = await cloudinary.v2.uploader.upload(
        req.files.photos[i].tempFilePath,
        {
          folder: "products",
        }
      );

      imageArray.push({
        public_id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }

  req.body.photos = imageArray;
  req.body.user = req.user.id;

  const products = await Product.create(req.body);

  res.status(200).json({
    success: true,
    products,
  });
});

exports.adminGetAllProducts = BigPromise(async (req, res, next) => {
  const products = await Product.find({});

  res.status(200).json({
    success: true,
    products,
  });
});

exports.adminUpdateOneProduct = BigPromise(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new CustomError("No Products Found related to the ID!!!", 401));
  }
  if (!req.files) {
    return next(new CustomError("Product Photos are Required!!!", 401));
  }

  let imagesArray = [];

  if (req.files) {
    for (let i = 0; i < product.photos.length; i++) {
      await cloudinary.v2.uploader.destroy(product.photos[i].public_id);
    }

    if (Array.isArray(req.files.photos)) {
      for (let i = 0; i < req.files.photos.length; i++) {
        const result = await cloudinary.v2.uploader.upload(
          req.files.photos[i].tempFilePath,
          { folder: "products" }
        );

        imagesArray.push({
          public_id: result.public_id,
          secure_url: result.secure_url,
        });
      }

      req.body.photos = imagesArray;
    } else {
      const result = await cloudinary.v2.uploader.upload(
        req.files.photos.tempFilePath,
        {
          folder: "products",
        }
      );

      imagesArray.push({
        public_id: result.public_id,
        secure_url: result.secure_url,
      });
      req.body.photos = imagesArray;
    }
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

exports.adminDeleteOneProduct = BigPromise(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new CustomError("No Products Found related to the ID!!!", 401));
  }

  for (let i = 0; i < product.photos.length; i++) {
    const res = await cloudinary.v2.uploader.destroy(
      product.photos[i].public_id
    );
  }

  product.remove();

  res.status(200).json({
    success: true,
    message: "Product was Deleted !!!",
  });
});

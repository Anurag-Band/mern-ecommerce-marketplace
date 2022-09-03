const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const BigPromise = require("../middlewares/BigPromise");
const CustomError = require("../utils/customError");

exports.createOrder = BigPromise(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsAmount,
    taxAmount,
    shippingAmount,
    totalAmount,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsAmount,
    taxAmount,
    shippingAmount,
    totalAmount,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    message: "order created successfully",
  });
});

exports.getOneOrder = BigPromise(async (req, res, next) => {
  const order = await Order.findById(req.query.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(
      new CustomError("order not found related to the provided ID !!!", 404)
    );
  }

  res.status(200).json({
    success: true,
    order,
  });
});

exports.getLoggedInUserOrders = BigPromise(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  if (!orders) {
    return next(
      new CustomError("order not found related to the provided ID !!!", 404)
    );
  }

  res.status(200).json({
    success: true,
    orders,
  });
});

exports.adminGetAllOrders = BigPromise(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

exports.adminUpdateOrder = BigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new CustomError("order not found related to the provided ID !!!", 404)
    );
  }

  if (order.orderStatus === "Delivered") {
    return next(
      new CustomError("this order is already marked as Delivered!!!", 400)
    );
  }

  if (req.body.orderStatus === "Shipped") {
    order.orderStatus = req.body.orderStatus;

    order.orderItems.forEach(async (prod) => {
      await updateProductStock(prod.product, prod.quantity);
    });
  }

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
    order.orderStatus = req.body.orderStatus;
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    order,
  });
});

exports.adminDeleteOrder = BigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new CustomError("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
    message: "Order was Deleted!!!",
  });
});

async function updateProductStock(productId, quantity) {
  const product = await Product.findById(productId);

  product.stock = product.stock - quantity;

  await product.save({ validateBeforeSave: false });
}

const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const BigPromise = require("../middlewares/BigPromise");
const CustomError = require("../utils/customError");

exports.getSingleUserCart = BigPromise(async (req, res, next) => {
  const user = req.user._id;

  const cart = await Cart.findOne({ user }).populate(
    "items.itemId",
    "photos stock"
  );

  if (cart && cart.items.length > 0) {
    res.status(200).json({
      success: true,
      cart,
    });
  } else {
    res.status(200).json({
      status: "cart is Empty",
      cart,
    });
  }
});

exports.addToCart = BigPromise(async (req, res, next) => {
  const user = req.user._id;

  const { itemId } = req.body;

  const quantity = 1;

  try {
    const cart = await Cart.findOne({ user });
    const product = await Product.findOne({ _id: itemId });

    if (!product) {
      return next(new CustomError("item not found", 404));
    }
    const price = product.price;
    const name = product.name;

    //If cart already exists for user,
    if (cart) {
      const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);
      //check if product exists or not

      if (itemIndex > -1) {
        let product = cart.items[itemIndex];
        product.quantity += quantity;

        cart.subTotal = cart.items.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);

        cart.items[itemIndex] = product;
        await cart.save();
        res.status(200).json({
          success: true,
          status: "product added to cart",
        });
      } else {
        cart.items.push({ itemId, name, quantity, price });
        cart.subTotal = cart.items.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);

        await cart.save();
        res.status(200).json({
          success: true,
          status: "product added to cart",
        });
      }
    } else {
      //no cart exists, create one
      await Cart.create({
        user,
        items: [{ itemId, name, quantity, price }],
        subTotal: quantity * price,
      });

      res.status(201).json({
        success: true,
        status: "product added to cart",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "cart failure, something went wrong",
    });
  }
});

exports.removeFromCart = BigPromise(async (req, res, next) => {
  const user = req.user._id;
  const itemId = req.query.itemId;
  try {
    let cart = await Cart.findOne({ user });

    const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);

    if (itemIndex > -1) {
      let item = cart.items[itemIndex];
      cart.subTotal -= item.quantity * item.price;
      if (cart.subTotal < 0) {
        cart.subTotal = 0;
      }
      cart.items.splice(itemIndex, 1);
      cart.subTotal = cart.items.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
      }, 0);

      res.status(200).json({
        success: true,
        status: "product deleted from cart",
      });
      await cart.save();
    } else {
      res.status(401).json({
        status: "Item not Found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "cart failure, something went wrong",
    });
  }
});

exports.decreaseCartItemQuantity = BigPromise(async (req, res, next) => {
  const user = req.user._id;
  const itemId = req.query.itemId;
  try {
    let cart = await Cart.findOne({ user });

    const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);

    if (itemIndex > -1) {
      let item = cart.items[itemIndex];

      if (item.quantity === 1) {
        res.status(200).json({
          success: true,
          status: "item quantity is 1",
        });
      } else {
        item.quantity -= 1;
        cart.subTotal -= item.price;

        if (cart.subTotal < 0) {
          cart.subTotal = 0;
        }
        res.status(200).json({
          success: true,
          status: "product quantity decreased from cart",
        });
        await cart.save();
      }
    }
  } catch (error) {
    res.status(500).json({
      status: "cart failure, something went wrong",
    });
  }
});

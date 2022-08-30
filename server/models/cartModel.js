const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    items: [
      {
        itemId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: Number,
      },
    ],
    subTotal: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    strict: false,
  }
);

module.exports = mongoose.model("Cart", cartSchema);

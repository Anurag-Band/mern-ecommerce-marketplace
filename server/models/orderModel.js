const mongoose = require("mongoose");

// shippingInfo{} ->> //{  phoneNo,
// user               //  Address,
// paymentInfo{}      //  city,
// taxAmount          //  postalCode,
// ShippingAmount     //  state,
// totalAmount        //  country  }
// orderStatus
// deliveredAt
// createdAt
// -------------------
// orderItems: [ {} ]
// - name
// - quantity
// - image[0]
// - price
// -product

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: [true, "Address is Required"],
      },
      city: {
        type: String,
        required: [true, "city is Required"],
      },
      postalCode: {
        type: Number,
        required: [true, "postalCode is Required"],
      },
      state: {
        type: String,
        required: [true, "state is Required"],
      },
      phoneNumber: {
        type: Number,
        required: [true, "phoneNumber is Required"],
      },
      country: {
        type: String,
        required: [true, "country is Required"],
      },
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        itemId: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    paymentInfo: {
      id: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
    },
    paidAt: {
      type: Date,
      required: true,
    },
    itemsAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    taxAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    orderStatus: {
      type: String,
      required: true,
      default: "Processing",
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);

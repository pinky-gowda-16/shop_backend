const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: String,
      required: true,
      trim: true,
    },
    product: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    items: {
      type: Array,
      default: [],
    },
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Order", orderSchema)
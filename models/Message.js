const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, trim: true },
    phone:   { type: String, default: "" },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status:  { type: String, enum: ["Unread", "Read"], default: "Unread" },
    replied: { type: Boolean, default: false },
    replyText: { type: String, default: "" },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Message", messageSchema)
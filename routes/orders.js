const express = require("express")
const Order = require("../models/Order")
const { protect, adminOnly } = require("../middleware/auth")

const router = express.Router()

// ── GET /api/orders ────────────────────────────────────────────
// Users can see their own orders, admins can see all
router.get("/", protect, async (req, res) => {
  try {
    let orders
    if (req.user.role === "admin") {
      // Admin sees all orders
      orders = await Order.find().sort({ createdAt: -1 })
    } else {
      // Regular users see only their orders (match by customer name or email)
      const userName = req.user.name || req.user.email
      orders = await Order.find({ 
        $or: [
          { customer: userName },
          { customer: req.user.email }
        ]
      }).sort({ createdAt: -1 })
    }
    res.json({ success: true, orders })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── POST /api/orders ───────────────────────────────────────────
router.post("/", protect, async (req, res) => {
  try {
    const { customer, product, amount, items, image, status } = req.body
    if (!customer || !product || amount == null)
      return res.status(400).json({ success: false, message: "Customer, product, and amount are required." })

    const order = await Order.create({ 
      customer, 
      product, 
      amount, 
      items: items || [],
      image: image || "",
      status: status || "Pending"
    })
    res.status(201).json({ success: true, order })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── PATCH /api/orders/:id/status ──────────────────────────────
router.patch("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body
    const allowed = ["Pending", "Shipped", "Delivered", "Cancelled"]
    if (!allowed.includes(status))
      return res.status(400).json({ success: false, message: "Invalid status." })

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!order) return res.status(404).json({ success: false, message: "Order not found." })

    res.json({ success: true, order })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── DELETE /api/orders/:id ─────────────────────────────────────
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id)
    if (!order) return res.status(404).json({ success: false, message: "Order not found." })
    res.json({ success: true, message: "Order deleted." })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
const express = require("express")
const Product = require("../models/Product")
const { protect, adminOnly } = require("../middleware/auth")

const router = express.Router()

// ── GET /api/products ──────────────────────────────────────────
// Public - all logged-in users can view products
router.get("/", protect, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
    res.json({ success: true, products })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── GET /api/products/:id ──────────────────────────────────────
router.get("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ success: false, message: "Product not found." })
    res.json({ success: true, product })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── POST /api/products ─────────────────────────────────────────
// Admin only
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { name, price, category, stock } = req.body
    if (!name || price == null || !stock == null)
      return res.status(400).json({ success: false, message: "Name, price, and stock are required." })

    const product = await Product.create({ name, price, category, stock })
    res.status(201).json({ success: true, product })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── PUT /api/products/:id ──────────────────────────────────────
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!product) return res.status(404).json({ success: false, message: "Product not found." })
    res.json({ success: true, product })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── DELETE /api/products/:id ───────────────────────────────────
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ success: false, message: "Product not found." })
    res.json({ success: true, message: "Product deleted." })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
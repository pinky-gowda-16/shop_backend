const express = require("express")
const User = require("../models/User")
const { protect, adminOnly } = require("../middleware/auth")

const router = express.Router()

// All routes require login + admin role
router.use(protect, adminOnly)

// ── GET /api/users ─────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json({ success: true, users })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── POST /api/users ────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields are required." })

    const exists = await User.findOne({ email })
    if (exists)
      return res.status(400).json({ success: false, message: "Email already exists." })

    const user = await User.create({ name, email, password, role: role || "user" })
    res.status(201).json({ success: true, user })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── PATCH /api/users/:id/role ──────────────────────────────────
router.patch("/:id/role", async (req, res) => {
  try {
    const { role } = req.body
    const allowed = ["admin", "user", "limited_user", "custom"]
    if (!allowed.includes(role))
      return res.status(400).json({ success: false, message: "Invalid role." })

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true })
    if (!user) return res.status(404).json({ success: false, message: "User not found." })

    res.json({ success: true, user })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── DELETE /api/users/:id ──────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ success: false, message: "User not found." })
    res.json({ success: true, message: "User deleted." })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
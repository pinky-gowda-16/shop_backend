const express = require("express")
const Message = require("../models/Message")
const { protect, adminOnly } = require("../middleware/auth")

const router = express.Router()

// ── POST /api/messages ─────────────────────────────────────────
// Public - anyone can submit a contact form
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body
    if (!name || !email || !subject || !message)
      return res.status(400).json({ success: false, message: "Name, email, subject, and message are required." })

    const msg = await Message.create({ name, email, phone, subject, message })
    res.status(201).json({ success: true, message: "Message sent successfully!", data: msg })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── GET /api/messages ──────────────────────────────────────────
// Admin only
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 })
    res.json({ success: true, messages })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── PATCH /api/messages/:id/read ──────────────────────────────
router.patch("/:id/read", protect, adminOnly, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { status: "Read" }, { new: true })
    if (!msg) return res.status(404).json({ success: false, message: "Message not found." })
    res.json({ success: true, message: msg })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── PATCH /api/messages/:id/reply ─────────────────────────────
router.patch("/:id/reply", protect, adminOnly, async (req, res) => {
  try {
    const { replyText } = req.body
    if (!replyText) return res.status(400).json({ success: false, message: "Reply text is required." })

    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { replied: true, replyText, status: "Read" },
      { new: true }
    )
    if (!msg) return res.status(404).json({ success: false, message: "Message not found." })
    res.json({ success: true, message: msg })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── DELETE /api/messages/:id ───────────────────────────────────
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id)
    if (!msg) return res.status(404).json({ success: false, message: "Message not found." })
    res.json({ success: true, message: "Message deleted." })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
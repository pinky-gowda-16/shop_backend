const express = require("express")
const cors    = require("cors")
const dotenv  = require("dotenv")
const path    = require("path")
const connectDB = require("./config/db")

// Load .env from shoplux-backend directory
dotenv.config({ path: path.join(__dirname, '.env') })
connectDB()

const app = express()

// ── Middleware ─────────────────────────────────────────────────
// Allow ALL origins during development
app.use(cors())
app.use(express.json())

// ── Routes ─────────────────────────────────────────────────────
app.use("/api/auth",     require("./routes/auth"))
app.use("/api/users",    require("./routes/users"))
app.use("/api/products", require("./routes/products"))
app.use("/api/orders",   require("./routes/orders"))
app.use("/api/messages", require("./routes/messages"))

// ── Health check ───────────────────────────────────────────────
app.get("/", (req, res) => res.json({ message: "✅ ShopLux API is running!" }))

// ── 404 handler ────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found." }))

// ── Error handler ──────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, message: "Internal server error." })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
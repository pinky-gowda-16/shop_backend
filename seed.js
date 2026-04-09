const mongoose = require("mongoose")
const Product = require("./models/Product")
const path = require("path")
require("dotenv").config({ path: path.join(__dirname, ".env") })

const products = [
  {
    name: "Laptop",
    price: 50000,
    category: "Electronics",
    stock: 15,
  },
  {
    name: "Phone",
    price: 20000,
    category: "Electronics",
    stock: 25,
  },
  {
    name: "Headphones",
    price: 3000,
    category: "Accessories",
    stock: 50,
  },
  {
    name: "Smartwatch",
    price: 8000,
    category: "Accessories",
    stock: 30,
  },
  {
    name: "Tablet",
    price: 35000,
    category: "Electronics",
    stock: 20,
  },
  {
    name: "Keyboard",
    price: 2500,
    category: "Accessories",
    stock: 40,
  },
]

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("✅ MongoDB connected")

    // Clear existing products
    await Product.deleteMany({})
    console.log("🗑️  Cleared existing products")

    // Insert seed products
    await Product.insertMany(products)
    console.log("✅ Seeded products successfully!")

    process.exit(0)
  } catch (err) {
    console.error("❌ Error seeding products:", err.message)
    process.exit(1)
  }
}

seedProducts()

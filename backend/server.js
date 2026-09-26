const express = require("express");
const dotenv = require("dotenv");
const dns = require("node:dns");

dotenv.config();

// Fix MongoDB Atlas SRV DNS resolution
dns.setServers([
  "1.1.1.1",
  "8.8.8.8",
]);

const connectDB = require("./config/db");
const productRoutes =
  require("./routes/productRoutes");

const orderRoutes =
  require("./routes/orderRoutes");

const paymentRoutes = require("./routes/paymentRoutes");

const authRoutes = require("./routes/authRoutes");

// console.log(process.env.RAZORPAY_KEY_ID);
// console.log(process.env.RAZORPAY_KEY_SECRET);

connectDB();

const app = express();

const cors = require("cors");

app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://dk-seed-store-website-2026.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/payment", paymentRoutes);

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("DK Seed Store Backend Running 🚀");
});

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
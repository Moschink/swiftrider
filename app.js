const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");

const authRouter = require("./router/userRouter");
const customerRouter = require("./router/customerRouter");
const adminRouter = require("./router/adminRouter");
const paystackRouter = require("./router/paystackRouter");

const app = express();
const port = 3000;

// ================= PAYSTACK WEBHOOK =================
// ✅ Mount paystackRouter under /paystack
// Webhook inside paystackRouter must use express.raw()
app.use(
  "/paystack/",
  express.raw({ type: "application/json" }),
  paystackRouter
);

// ================= GENERAL MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= ROUTES =================
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/create", customerRouter);
app.use("/", customerRouter);
app.use("/paystack", paystackRouter); // other paystack routes (init payment etc.)

// ================= DB CONNECTION =================
mongoose
  .connect(process.env.DB_url)
  .then(() => console.log("✅ Connected to the database"))
  .catch((err) => console.log("❌ DB connection error:", err));

// ================= START SERVER =================
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});

module.exports = app;
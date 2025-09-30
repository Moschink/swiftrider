const express = require('express');
require("dotenv").config();
const mongoose = require("mongoose");

const authRouter = require("./router/userRouter");
const customerRouter = require("./router/customerRouter");
const adminRouter = require("./router/adminRouter");
const paystackRouter = require("./router/paystackRouter");

const app = express();
const port = 3000;

// ✅ Use express.json() for all routes *except* /webhook
app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// ================= ROUTES =================
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/create", customerRouter);
app.use("/", customerRouter);
app.use("/", paystackRouter); // includes webhook + paystack routes

// ================= DB CONNECTION =================
mongoose.connect(process.env.DB_url)
  .then(() => console.log("✅ Connected to the database"))
  .catch((err) => console.log("❌ DB connection error:", err));

// ================= START SERVER =================
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});

module.exports = app;

const express = require("express");
const paystackController = require("../controller/paystackController");
const roleBasedAccess = require("../middleware/roleBasedAccess");
const checkIfLoggedIn = require("../middleware/checkIfLoggedIn");

const router = express.Router();

// ================= INITIALIZE PAYMENT =================
// ✅ Protected: only logged-in customers can initialize
router.post(
  "/initialize-payment",
  checkIfLoggedIn,
  roleBasedAccess(["customer"]),
  paystackController.initializePayment
);

// ================= WEBHOOK =================
// ❌ Do NOT protect this route (Paystack is external, not logged in)
// Mounted in app.js with express.raw()
router.post("/webhook", paystackController.paystackWebhook);

module.exports = router;
const express = require("express");
const paystackController = require("../controller/paystackController");
const roleBasedAccess = require("../middleware/roleBasedAccess");
const checkIfLoggedIn = require("../middleware/checkIfLoggedIn");

const router = express.Router();

router.post(
  "/initialize-payment",
  checkIfLoggedIn,
  roleBasedAccess(["customer"]),
  paystackController.initializePayment
);


module.exports = router;
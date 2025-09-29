const express = require("express");

const adminController = require("../controller/adminController");
const roleBasedAccess = require("../middleware/roleBasedAccess");
const checkIfLoggedIn = require("../middleware/checkIfLoggedIn");
const router = express.Router();
router.use(checkIfLoggedIn);
// routes/adminRoutes.js
// routes/adminRoutes.js
router.get("/users", roleBasedAccess(["admin"]), adminController.viewAllUsers);
router.get("/analytics", roleBasedAccess(["admin"]), adminController.getAnalytics);
router.get("/deliveries", roleBasedAccess(["admin"]), adminController.viewAllDeliveries);
router.get("/deliveries/:id", roleBasedAccess(["admin"]), adminController.getDeliveryById);
router.put("/deliveries/:id", roleBasedAccess(["admin"]), adminController.updateDelivery);
router.delete("/deliveries/:id", roleBasedAccess(["admin"]), adminController.deleteDelivery);



module.exports = router
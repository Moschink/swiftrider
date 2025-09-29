const express = require("express");
const customerController = require("../controller/customerController");
const riderController = require("../controller/riderController");
const router = express.Router();
const roleBasedAccess = require("../middleware/roleBasedAccess");
const checkIfLoggedIn = require("../middleware/checkIfLoggedIn");



router.use(checkIfLoggedIn);
//CUSTOMER'S ROUTER
router.post("/delivery", roleBasedAccess(["customer"]), customerController.orderDelivery);
router.get("/location/:id", roleBasedAccess(["admin","customer"]), customerController.getLocation);



//RIDER'S ROUTE
router.get("/view-deliveries", roleBasedAccess(["rider"]), riderController.viewPendingDeliveries);
router.patch("/accept-delivery", roleBasedAccess(["rider"]), riderController.acceptDelivery);
router.post("/update-delivery", roleBasedAccess(["rider"]), riderController.updateDeliveryStatus);
router.put("/location", roleBasedAccess(["rideer"]), riderController.updateLocation)


module.exports = router
const deliveryModel = require("../schema/delivery");
const userModel = require("../schema/user");
const sendEmail = require("../utility/sendEmail")
const joi = require("joi");
require("dotenv").config();

// 1. Rider views all pending deliveries
const viewPendingDeliveries = async (req, res) => {
  try {
    const deliveries = await deliveryModel.find({ status: "pending" });

    if (deliveries.length === 0) {
      return res.status(200).json({ message: "No pending deliveries" });
    }

    res.status(200).json(deliveries);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 2. Rider accepts a delivery
const acceptDelivery = async (req, res) => {
  try {
    const { deliveryId } = req.body;

    // Find & update delivery in one step
    const delivery = await deliveryModel.findOneAndUpdate(
      { _id: deliveryId, status: "pending" },
      { status: "accepted", riderId: req.decoded.ownerId },
      { new: true }
    );

    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found or already accepted" });
    }

    //  Respond to client immediately
    res.status(200).json({
      message: "Delivery accepted successfully",
      delivery
    });

    (async () => {
  try {
    const [customer, rider] = await Promise.all([
      userModel.findById(delivery.ownerId),
      userModel.findById(delivery.riderId)
    ]);

    if (customer && rider) {
      if (!customer.email) {
        console.error("❌ Customer email missing:", customer);
        return;
      }

      await sendEmail({
        to: customer.email,
        subject: "Delivery Accepted",
        html: `
          <h2>Hello ${customer.fullName},</h2>
          <p>Your delivery request has been <b>accepted</b> by <b>${rider.fullName}</b>.</p>
          <p>Please prepare your package. The rider will contact you shortly.</p>
          <br/>
          <p>Thank you for using our service!</p>
        `
      });
    }
  } catch (bgError) {
    console.error("Background email error:", bgError.message);
  }
})();

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



const updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryId, status } = req.body;
    const riderId = req.decoded.ownerId; // logged-in rider

    const validStatuses = ["accepted", "picked-up", "delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Find delivery
    const delivery = await deliveryModel.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    // Ensure delivery is assigned to this rider
    if (delivery.riderId?.toString() !== riderId.toString()) {
      return res.status(403).json({ error: "You are not assigned to this delivery" });
    }

    // Validate status transition
    const currentStatus = delivery.status;
    const allowedTransitions = {
      accepted: ["picked-up"],
      "picked-up": ["delivered"],
      delivered: [] // final state
    };

    if (!allowedTransitions[currentStatus].includes(status)) {
      return res.status(400).json({
        error: `Invalid status transition: ${currentStatus} → ${status}`
      });
    }

    //  Update and save
    delivery.status = status;
    await delivery.save();

    //  Respond immediately (non-blocking)
    res.status(200).json({
      message: `Delivery status updated to ${status}`,
      delivery
    });

    //  Background: fetch users + send email
    (async () => {
  try {
    const [customer, rider] = await Promise.all([
      userModel.findById(delivery.ownerId),
      userModel.findById(delivery.riderId)
    ]);

    if (!customer) {
      console.error(" Customer not found in DB:", delivery.ownerId);
      return;
    }
    if (!customer.email) {
      console.error(" Customer email missing:", customer);
      return;
    }
    if (!rider) {
      console.error(" Rider not found in DB:", delivery.riderId);
    }

    await sendEmail({
      to: customer.email,
      subject: `Delivery has been ${status}`,
      html: `
        <h2>Hello ${customer.fullName},</h2>
        <p>Your delivery request has been <b>${status}</b> by rider <b>${rider.fullName}</b>.</p>
        <br/>
        <p>Thank you for using our service!</p>
      `
    });

    console.log(` Status update email sent to ${customer.email}`);

  } catch (bgError) {
    console.error(" Background email error:", bgError.response?.body || bgError.message);
  }
})();


  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateLocation = async (req, res) => {
  try {
    const riderId = req.decoded.ownerId; // from auth middleware
    const { latitude, longitude } = req.body;

    const rider = await userModel.findByIdAndUpdate(
      riderId,
      { location: { latitude, longitude, updatedAt: new Date() } },
      { new: true }
    );

    if (!rider) return res.status(404).json({ error: "Rider not found" });

    res.status(200).json({
      message: "Location updated successfully",
      location: rider.location
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
  viewPendingDeliveries,
  acceptDelivery,
  updateDeliveryStatus,
  updateLocation
};

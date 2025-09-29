const deliveryModel = require("../schema/delivery");
const userModel = require("../schema/user");
const transporter = require("../utility/sendEmail")
const joi = require("joi");

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

    // find the delivery
    const delivery = await deliveryModel.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    if (delivery.status !== "pending") {
      return res.status(400).json({ error: "Delivery already accepted or completed" });
    }

    // update delivery with rider
    delivery.status = "accepted";
    delivery.riderId = req.decoded.ownerId; // rider logged in
    await delivery.save();

    // find customer & rider
    const customer = await userModel.findById(delivery.ownerId);
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    const rider = await userModel.findById(delivery.riderId);
    if (!rider) return res.status(404).json({ error: "Rider not found" });

    // send email
    await transporter.sendMail({
      from: "maxmosh8@gmail.com",
      to: "moshtechy@gmail.com",
      subject: "Delivery Accepted",
      html: `
        <h2>Hello ${customer.fullName},</h2>
        <p>Your delivery request has been <b>accepted</b> by <b>${rider.fullName}</b>.</p>
        <p>Please prepare your package. The rider will contact you shortly.</p>
        <br/>
        <p>Thank you for using our service!</p>
      `
    });

    return res.status(200).json({
      message: "Delivery accepted successfully & email sent",
      delivery
    });

  } catch (error) {
    return res.status(400).json({ error: error.message });
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

    const delivery = await deliveryModel.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    // Ensure this delivery is assigned to this rider
    if (delivery.riderId?.toString() !== riderId.toString()) {
      return res.status(403).json({ error: "You are not assigned to this delivery" });
    }

    // Enforce step-by-step transitions
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

    // Update status
    delivery.status = status;
    await delivery.save();

    // find customer & rider for email
    const customer = await userModel.findById(delivery.ownerId);
    const rider = await userModel.findById(delivery.riderId);

    if (customer && rider) {
      await transporter.sendMail({
        from: "maxmosh8@gmail.com",
        to: "moshtechy@gmail.com", // dynamic email
        subject: `Delivery has been ${status}`,
        html: `
          <h2>Hello ${customer.fullName},</h2>
          <p>Your delivery request has been <b>${status}</b> by rider <b>${rider.fullName}</b>.</p>
          <br/>
          <p>Thank you for using our service!!</p>
        `
      });
    }

    return res.status(200).json({
      message: `Delivery status updated to ${status} & email sent`,
      delivery
    });

  } catch (error) {
    return res.status(400).json({ error: error.message });
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

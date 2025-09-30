const axios = require("axios");
const express = require("express");
const crypto = require("crypto");
require("dotenv").config();

const deliveryModel = require("../schema/delivery");
const userModel = require("../schema/user");

// 1. Initialize Payment
const initializePayment = async (req, res) => {
  try {
    const { deliveryId } = req.body;
    const userEmail = req.decoded.email;

    // Fetch delivery cost from DB instead of client input
    const delivery = await deliveryModel.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: userEmail,
        amount: delivery.cost * 100, // Paystack expects kobo
        metadata: { deliveryId } // 👈 send deliveryId to webhook
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("=============== Initialize Payment ====================");
    console.log("Payment response:", response.data);

    return res.status(200).json({ result: response.data });
  } catch (error) {
    console.error("Initialize Payment Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// 2. Paystack Webhook
const paystackWebhook = async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;

    // ✅ req.body is a Buffer because of express.raw()
    const hash = crypto
      .createHmac("sha512", secret)
      .update(req.body) // raw buffer
      .digest("hex");

    // Validate Paystack signature
    if (hash !== req.headers["x-paystack-signature"]) {
      return res.sendStatus(401); // Unauthorized
    }

    // ✅ Parse raw buffer into JSON
    const eventData = JSON.parse(req.body.toString());

    console.log("=============== Webhook Response ====================");
    console.log(eventData);

    if (eventData.event === "charge.success") {
      const deliveryId = eventData.data.metadata.deliveryId; // 👈 safe now
      const reference = eventData.data.reference;

      // Mark delivery as paid
      const delivery = await deliveryModel.findByIdAndUpdate(
        deliveryId,
        { status: "paid", paymentReference: reference },
        { new: true }
      );

      console.log("✅ Delivery payment confirmed:", delivery);
    }

    return res.sendStatus(200); // ACK to Paystack
  } catch (error) {
    console.error("Webhook Error:", error.message);
    return res.sendStatus(500);
  }
};

module.exports = {
  initializePayment,
  paystackWebhook
};

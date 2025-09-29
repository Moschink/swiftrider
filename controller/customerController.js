// const express = require("express");
// const router = express.Router();
const deliveryModel = require("../schema/delivery");
const userModel = require("../schema/user");
const joi = require("joi");

const orderDelivery = async (req, res) => {
    try {
    const { pickupLocation, dropoffLocation, packageDetails, cost } = req.body;

    // Create new delivery
    const delivery = await deliveryModel.create({
      ownerId: req.decoded.ownerId,
      pickupLocation,
      dropoffLocation,
      packageDetails,
      cost
    });

    res.status(201).json({
      message: "Delivery request created successfully",
      delivery
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getLocation = async (req, res) => {
  try {
    const riderId = req.params.id;
    const rider = await userModel.findById(riderId, "fullName location");

    if (!rider) return res.status(404).json({ error: "Rider not found" });

    res.status(200).json({
      rider: rider.fullName,
      location: rider.location
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
    orderDelivery,
    getLocation
}

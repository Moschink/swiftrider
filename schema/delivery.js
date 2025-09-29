const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "customers", 
    required: true 
  },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  packageDetails: { type: String, required: true },
  cost: { type: Number, required: true },
  status: {
  type: String,
  enum: ["pending", "accepted", "picked-up", "delivered"],
  default: "pending"
},

  riderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "customers", // assuming riders are also stored in customers
    default: null
  }
}, { timestamps: true });

const deliveryModel = mongoose.model("delivery", schema);
module.exports = deliveryModel;
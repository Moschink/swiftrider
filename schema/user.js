const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
     role: {
         type: String,
          enum :[ "rider","admin","customer"],
         required: true
     },
     location: {
    latitude: { type: Number },
    longitude: { type: Number },
    updatedAt: { type: Date }
  }

}, {timestamps: true});

const userModel = mongoose.model("customers", schema);

module.exports = userModel;
const userModel = require("../schema/user"); // your customers schema
const deliveryModel = require("../schema/delivery");

const viewAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, "-password"); // exclude passwords
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const viewAllDeliveries = async (req, res) => {
  try {
    const deliveries = await deliveryModel.find()
      .populate("ownerId", "fullName email")
      .populate("riderId", "fullName email");
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getDeliveryById = async (req, res) => {
  try {
    const delivery = await deliveryModel.findById(req.params.id)
      .populate("ownerId", "fullName email")
      .populate("riderId", "fullName email");

    if (!delivery) return res.status(404).json({ error: "Delivery not found" });
    res.status(200).json(delivery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateDelivery = async (req, res) => {
  try {
    const updated = await deliveryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Delivery not found" });
    res.status(200).json({ message: "Delivery updated", delivery: updated });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteDelivery = async (req, res) => {
  try {
    const deleted = await deliveryModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Delivery not found" });
    res.status(200).json({ message: "Delivery deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const totalDeliveries = await deliveryModel.countDocuments();
    const completedDeliveries = await deliveryModel.countDocuments({ status: "completed" });
    const deliveriesInProgress = await deliveryModel.countDocuments({ status: "in-progress" });
    const acceptedDeliveries = await deliveryModel.countDocuments({ status: "accepted" });
    const pendingDeliveries = await deliveryModel.countDocuments({ status: "pending" });

    const revenueAgg = await deliveryModel.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, totalRevenue: { $sum: "$cost" } } }
    ]);

    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    res.status(200).json({
      completedDeliveries,
      deliveriesInProgress,
      acceptedDeliveries,
      pendingDeliveries,
      totalDeliveries,
      totalRevenue
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
    viewAllUsers,
    getAnalytics,
    viewAllDeliveries,
    getDeliveryById,
    updateDelivery,
    deleteDelivery
};
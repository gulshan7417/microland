const Medicine = require("../models/Medicine");

exports.createMedicine = async (req, res, next) => {
  try {
    const { name, dosage, time, duration } = req.body;
    if (!name || !dosage || !time || !duration) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const medicine = await Medicine.create({
      userId: req.user.id,
      name,
      dosage,
      time,
      duration
    });

    res.status(201).json(medicine);
  } catch (err) {
    next(err);
  }
};

// Simple daily schedule: return today's medicines ordered by time
exports.getDailySchedule = async (req, res, next) => {
  try {
    const medicines = await Medicine.find({ userId: req.user.id }).sort({ time: 1 });
    res.json(medicines);
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["taken", "missed", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const medicine = await Medicine.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { status },
      { new: true }
    );

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.json(medicine);
  } catch (err) {
    next(err);
  }
};


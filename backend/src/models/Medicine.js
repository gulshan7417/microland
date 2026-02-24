const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    time: { type: String, required: true }, // store as "HH:MM" in 24h format for simplicity
    duration: { type: String, required: true }, // e.g. "7 days"
    status: {
      type: String,
      enum: ["pending", "taken", "missed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medicine", medicineSchema);


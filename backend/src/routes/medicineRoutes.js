const express = require("express");
const router = express.Router();
const medicineController = require("../controllers/medicineController");

router.post("/", medicineController.createMedicine);
router.get("/daily", medicineController.getDailySchedule);
router.patch("/:id/status", medicineController.updateStatus);

module.exports = router;


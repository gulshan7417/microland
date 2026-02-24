const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

router.post("/generate", aiController.generateSchedule);
router.post("/apply", aiController.applySchedule);

module.exports = router;


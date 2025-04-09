const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

router.get("/cases", reportController.generateCaseReport);

module.exports = router;

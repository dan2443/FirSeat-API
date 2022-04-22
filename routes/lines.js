const express = require("express");

const linesController = require("../controllers/lines");

const router = express.Router();

// GET /lines/lines?
router.get("/lines", linesController.getLines);
// POST /lines/create
router.post("/create", linesController.createLine);

router.get("/lines/:stationId", linesController.getLinesOfStation);

router.put("/lines/:lineId", linesController.updateLine);

module.exports = router;

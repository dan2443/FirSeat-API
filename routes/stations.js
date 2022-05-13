const express = require("express");

const stationsController = require("../controllers/stations");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

//if want to verify token, add isAuth in router declerations

// GET /stations/stations?
router.get("/", stationsController.getStations);
// POST /stations/create
router.post("/create", stationsController.createStation);

router.post("/:stationId/:lineId", stationsController.addLine);

router.put("/:stationId", stationsController.updateStation);

router.delete("/:stationId/:lineId", stationsController.removeLine);

router.delete("/:stationId", stationsController.deleteStation);

module.exports = router;

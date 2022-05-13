const express = require("express");

const tripsController = require("../controllers/trips");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", tripsController.getTrips);

router.get("/:stationId/:lineId", tripsController.getTripsOfStationAndLine);

router.post("/create", tripsController.createTrip);

router.post("/register", tripsController.registerToTrip);

router.post("/unregister", tripsController.unregisterFromTrip);

router.put("/:tripId", tripsController.updateTrip);

router.delete("/:tripId", tripsController.deleteTrip);

module.exports = router;

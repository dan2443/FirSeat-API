const express = require("express");

const linesController = require("../controllers/lines");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

//if want to verify token, add isAuth in router declerations

// GET /lines/lines?
router.get("/", linesController.getLines);
// POST /lines/create
router.post("/create", linesController.createLine);

router.get("/:stationId", linesController.getLinesOfStation);

router.put("/:lineId", linesController.updateLine);

router.delete("/:lineId", linesController.deleteLine);

module.exports = router;

/*
router.post(
  "/register",
  [
    body("userName").trim().isLength({ min: 6 }),
    body("password").trim().isLength({ min: 6 }),
  ],
  userController.registerUser
);
*/

const express = require("express");
const { body } = require("express-validator");

const userController = require("../controllers/user");

const router = express.Router();

// POST /user/register
router.post(
  "/register",
  [
    body("userName").trim().isLength({ min: 6 }),
    body("password").trim().isLength({ min: 6 }),
  ],
  userController.registerUser
);

module.exports = router;

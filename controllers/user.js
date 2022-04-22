const { validationResult } = require("express-validator");

exports.registerUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({
        message: "Validation failed, entered data is incorrect.",
        errors: errors.array(),
      });
  }
  const userName = req.body.userName;
  const password = req.body.password;
  //create post in db (deal with password)
  res.status(200).json({
    message: "User registered successfully!",
    data: { date: new Date().toISOString(), id: "1" }, //id back from server?
  });
};

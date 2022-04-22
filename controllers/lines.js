const { validationResult } = require("express-validator");
const Line = require("../models/line");

exports.getLines = (req, res, next) => {
  Line.find()
    .then((lines) => {
      if (!lines) {
        const error = new Error("Could not find any lines.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "lines fetched.", lines: lines });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createLine = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.status = 422;
    throw error;
  }
  const lineNumber = req.body.lineNumber;
  const finalDestination = req.body.finalDestination;
  const line = new Line({
    lineNumber: lineNumber,
    finalDestination: finalDestination,
    station: { name: "Tel Aviv Ashalom" },
  });
  line
    .save()
    .then((result) => {
      res.status(200).json({
        message: "Line created successfully!",
        line: result,
      });
      console.log(result);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getLinesOfStation = (req, res, next) => {
  const stationId = req.params.stationId;
  Line.findById(stationId)
    .then((lines) => {
      if (!lines) {
        const error = new Error("Could not find lines by stationId.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "lines fetched.", lines: lines });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateLine = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.status = 422;
    throw error;
  }
  const lineId = req.params.lineId;
  const lineNumber = req.body.lineNumber;
  const finalDestination = req.body.finalDestination;
  Line.findById(lineId)
    .then((line) => {
      if (!line) {
        const error = new Error("Could not find lines by stationId.");
        error.statusCode = 404;
        throw error;
      }
      line.lineNumber = lineNumber;
      line.finalDestination = finalDestination;
      return line.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Line updated!", line: result });
    })
    .catch();
};

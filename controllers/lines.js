const { validationResult } = require("express-validator");
const Line = require("../models/line");
const Station = require("../models/station");

exports.getLines = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const size = req.query.size || 4;
  let totalItems;
  Line.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Line.find()
        .skip((currentPage - 1) * size)
        .limit(size);
    })
    .then((lines) => {
      res.status(200).json({
        message: "lines fetched.",
        lines: lines,
        totalItems: totalItems,
      });
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
  Station.findById(stationId)
    .then((station) => {
      if (!station) {
        const error = new Error("Could not find station by stationId.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "lines fetched.", lines: station.lines });
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
        const error = new Error("Could not find line by lineId.");
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
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteLine = (req, res, next) => {
  const lineId = req.params.lineId;
  Line.findById(lineId)
    .then((line) => {
      if (!line) {
        const error = new Error("Could not find line by lineId.");
        error.statusCode = 404;
        throw error;
      }
      // checked logged in user?
      const stations = line.stations;
      for (const station of stations) {
        Station.findById(station).then((station) => {
          if (!station) {
            const error = new Error("Could not find station of line to pop.");
            error.statusCode = 404;
            throw error;
          }
          station.lines.pull(lineId);
          station.save();
        });
      }

      return Line.findByIdAndRemove(lineId);
    })
    .then((result) => {
      res.status(200).json({ message: "Deleted line" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

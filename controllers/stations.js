const { validationResult } = require("express-validator");
const Line = require("../models/line");
const Station = require("../models/station");

exports.getStations = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const size = req.query.size || 4;
  let totalItems;
  Station.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Station.find()
        .skip((currentPage - 1) * size)
        .limit(size);
    })
    .then((stations) => {
      res.status(200).json({
        message: "stations fetched.",
        stations: stations,
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

exports.createStation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.status = 422;
    throw error;
  }
  const stationNumber = req.body.stationNumber;
  const name = req.body.name;
  const NFCToken = req.body.NFCToken;
  const station = new Station({
    stationNumber: stationNumber,
    name: name,
    NFCToken: NFCToken,
  });
  station
    .save()
    .then((result) => {
      res.status(200).json({
        message: "Station created successfully!",
        station: result,
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

exports.addLine = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.status = 422;
    throw error;
  }
  const stationId = req.params.stationId;
  const lineId = req.params.lineId;
  Station.findById(stationId).then((station) => {
    if (!station) {
      const error = new Error("Could not find station by stationId.");
      error.statusCode = 404;
      throw error;
    }
    Line.findById(lineId)
      .then((line) => {
        if (!line) {
          const error = new Error("Could not find line by lineId.");
          error.statusCode = 404;
          throw error;
        }
        line.stations.push(station);
        station.lines.push(line);

        line.save();

        return station.save();
      })
      .then((result) => {
        res
          .status(200)
          .json({ message: "Line was added to station!", station: result });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  });
};

exports.removeLine = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.status = 422;
    throw error;
  }
  const stationId = req.params.stationId;
  const lineId = req.params.lineId;
  Station.findById(stationId).then((station) => {
    if (!station) {
      const error = new Error("Could not find station by stationId.");
      error.statusCode = 404;
      throw error;
    }
    Line.findById(lineId)
      .then((line) => {
        if (!line) {
          const error = new Error("Could not find line by lineId.");
          error.statusCode = 404;
          throw error;
        }
        station.lines.pull(line);
        line.stations.pull(station);

        line.save();

        return station.save();
      })
      .then((result) => {
        res.status(200).json({
          message: "Line was removed from station successfully",
          station: result,
        });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  });
};

exports.deleteStation = (req, res, next) => {
  const stationId = req.params.stationId;
  Station.findById(stationId)
    .then((station) => {
      if (!station) {
        const error = new Error("Could not find station by stationId.");
        error.statusCode = 404;
        throw error;
      }
      // checked logged in user?
      const lines = station.lines;
      for (const line of lines) {
        Line.findById(line).then((line) => {
          if (!line) {
            const error = new Error("Could not find line of station to pop.");
            error.statusCode = 404;
            throw error;
          }
          line.stations.pull(stationId);
          line.save();
        });
      }
      return Station.findByIdAndRemove(stationId);
    })
    .then((result) => {
      res.status(200).json({ message: "Deleted station" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateStation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.status = 422;
    throw error;
  }
  const stationId = req.params.stationId;
  const stationNumber = req.body.stationNumber;
  const name = req.body.name;
  Station.findById(stationId)
    .then((station) => {
      if (!station) {
        const error = new Error("Could not find station by stationId.");
        error.statusCode = 404;
        throw error;
      }
      station.stationNumber = stationNumber;
      station.name = name;
      return station.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Station updated!", station: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getStationByNFCToken = (req, res, next) => {
  const NFCToken = req.params.NFCToken;
  Station.find({ NFCToken: NFCToken })
    .then((station) => {
      if (!station) {
        const error = new Error("Could not find station by NFCToken.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: "station fetched.",
        station: station,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

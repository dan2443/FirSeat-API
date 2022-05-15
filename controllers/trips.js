const { validationResult } = require("express-validator");
const Line = require("../models/line");
const Station = require("../models/station");
const Trip = require("../models/trip");

exports.getTrips = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const size = req.query.size || 4;
  let totalItems;
  Trip.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Trip.find()
        .skip((currentPage - 1) * size)
        .limit(size);
    })
    .then((trips) => {
      res.status(200).json({
        message: "trips fetched.",
        trips: trips,
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

exports.getTripsOfStationAndLine = (req, res, next) => {
  const stationId = req.params.stationId;
  const lineId = req.params.lineId;
  Trip.find({ stationId: stationId, lineId: lineId }).then((trips) => {
    res.status(200).json({
      message: "trips fetched.",
      trips: trips,
    });
  });
};

exports.createTrip = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.status = 422;
    throw error;
  }
  const stationId = req.body.stationId;
  const lineId = req.body.lineId;
  const time = req.body.time;
  Line.findById(lineId)
    .then((line) => {
      if (!line) {
        const error = new Error("Could not find line by lineId.");
        error.statusCode = 404;
        throw error;
      }
      const trip = new Trip({
        stationId: stationId,
        lineId: lineId,
        time: time,
        lineNumber: line.lineNumber,
        finalDestination: line.finalDestination,
      });
      trip
        .save()
        .then((result) => {
          res.status(200).json({
            message: "Trip created successfully!",
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
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateTrip = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.status = 422;
    throw error;
  }
  const tripId = req.params.tripId;
  const stationId = req.body.stationId;
  const lineId = req.body.lineId;
  const time = req.body.time;
  Line.findById(lineId).then((line) => {
    if (!line) {
      const error = new Error("Could not find line by lineId.");
      error.statusCode = 404;
      throw error;
    }
    Trip.findById(tripId)
      .then((trip) => {
        if (!trip) {
          const error = new Error("Could not find trip by tripId.");
          error.statusCode = 404;
          throw error;
        }
        trip.stationId = stationId;
        trip.lineId = lineId;
        trip.time = time;
        trip.lineNumber = line.lineNumber;
        trip.finalDestination = line.finalDestination;
        return trip.save();
      })
      .then((result) => {
        res.status(200).json({ message: "Trip updated!", trip: result });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  });
};

exports.deleteTrip = (req, res, next) => {
  const tripId = req.params.tripId;
  Trip.findById(tripId)
    .then((trip) => {
      if (!trip) {
        const error = new Error("Could not find trip by tripId.");
        error.statusCode = 404;
        throw error;
      }
      // checked logged in user?

      return Trip.findByIdAndRemove(tripId);
    })
    .then((result) => {
      res.status(200).json({ message: "Deleted trip" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.registerToTrip = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.status = 422;
    throw error;
  }
  const tripId = req.body.tripId;
  const userId = req.body.userId;
  Trip.findById(tripId)
    .then((trip) => {
      if (!trip) {
        const error = new Error("Could not find trip by tripId.");
        error.statusCode = 404;
        throw error;
      }
      if (trip.registeredUsers.includes(userId)) {
        const error = new Error("User is already registered to this trip.");
        error.statusCode = 400;
        throw error;
      }
      if (trip.avalibleSeats < 1) {
        const error = new Error("Trip is full.");
        error.statusCode = 400;
        throw error;
      }
      trip.registeredUsers.push(userId);
      trip.avalibleSeats--;

      return trip.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "User was registered to trip successfully!",
        trip: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.unregisterFromTrip = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.status = 422;
    throw error;
  }
  const tripId = req.body.tripId;
  const userId = req.body.userId;
  Trip.findById(tripId)
    .then((trip) => {
      if (!trip) {
        const error = new Error("Could not find trip by tripId.");
        error.statusCode = 404;
        throw error;
      }
      if (!trip.registeredUsers.includes(userId)) {
        const error = new Error("User is not registered to this trip.");
        error.statusCode = 400;
        throw error;
      }
      trip.registeredUsers.pull(userId);
      trip.avalibleSeats++;

      return trip.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "User was unregistered from trip successfully!",
        trip: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

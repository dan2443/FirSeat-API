const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tripSchema = new Schema(
  {
    stationId: {
      type: String,
      required: true,
    },
    lineId: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    availableSeats: {
      type: Number,
      default: 50,
    },
    registeredUsers: [
      {
        type: String,
      },
    ],
    lineNumber: {
      type: String,
    },
    finalDestination: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);

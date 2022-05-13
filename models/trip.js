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
    avalibleSeats: {
      type: Number,
      default: 50,
    },
    registeredUsers: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
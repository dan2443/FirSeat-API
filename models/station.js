const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stationSchema = new Schema({
  stationNumber: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  lines: [
    {
      type: Schema.Types.ObjectId,
      ref: "Line",
    },
  ],
});

module.exports = mongoose.model("Station", stationSchema);

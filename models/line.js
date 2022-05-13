const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lineSchema = new Schema(
  {
    lineNumber: {
      type: String,
      required: true,
    },
    finalDestination: {
      type: String,
      required: true,
    },
    stations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Station",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Line", lineSchema);

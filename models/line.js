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
    station: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Line", lineSchema);

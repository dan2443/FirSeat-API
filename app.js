const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const port = process.env.PORT || 8080;

const linesRoutes = require("./routes/lines");
const authRoutes = require("./routes/auth");
const stationRoutes = require("./routes/stations");
const tripsRoutes = require("./routes/trips");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  //fixes CORS error
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/lines", linesRoutes);
app.use("/auth", authRoutes);
app.use("/stations", stationRoutes);
app.use("/trips", tripsRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    "mongodb+srv://firseat:JoIRpGSWUD888miS@firseat.gsg55.mongodb.net/firseat?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(port);
  })
  .catch((err) => console.log(err));

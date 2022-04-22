const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const linesRoutes = require("./routes/lines");
const userRouts = require("./routes/user");

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
app.use("/user", userRouts);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(
    "mongodb+srv://firseat:JoIRpGSWUD888miS@firseat.gsg55.mongodb.net/firseat?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(8080); //port is 8080
  })
  .catch((err) => console.log(err));

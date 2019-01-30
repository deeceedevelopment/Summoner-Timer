var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var logger = require("morgan");
const mongoose = require("mongoose");

var apiRouter = require("./routes/api");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use("/api", apiRouter);

//DATABASE CONNECTION
mongoose.connect(
  "mongodb://admin:password1@ds243084.mlab.com:43084/lol-flash-timer",
  { useNewUrlParser: true }
);

if (process.env.NODE_ENV === "production") {
  //set static folder for react SPA (build folder)
  app.use(express.static("client/build"));
  app.get("*", (req, res, next) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//MONGO DB:
//store 3 things: currentPatch, summonerSpellData, championData

module.exports = app;

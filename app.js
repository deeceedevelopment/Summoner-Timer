//process.env.API_KEY = "";

var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var logger = require("morgan");

//var indexRouter = require("./routes/index");
var apiRouter = require("./routes/api");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, "public")));

//app.use("/", indexRouter);
app.use("/api", apiRouter);

if (process.env.NODE_ENV === "production") {
  //set static folder for react SPA (build folder)
  app.use(express.static("client/build"));
  app.get("*", (req, res, next) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

module.exports = app;

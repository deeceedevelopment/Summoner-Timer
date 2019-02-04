var express = require("express");
var path = require("path");
var logger = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");

var app = express();

//PASSPORT CONFIGURATION
require("./passport")(passport);

//DATABASE CONNECTION
mongoose.connect(
  "mongodb://admin:password1@ds243084.mlab.com:43084/lol-flash-timer",
  { useNewUrlParser: true }
);

//APP CONFIGURATION
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

//EXPRESS ROUTER
var apiRouter = require("./routes/api");
var adminRouter = require("./routes/admin");

//RATE LIMITING
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30
});

const adminLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 10 // start blocking after 5 requests
});

app.use("/api/", apiLimiter, apiRouter);
app.use("/admin/", adminLimiter, adminRouter);

if (process.env.NODE_ENV === "production") {
  //set static folder for react SPA (build folder)
  app.use(express.static("client/build"));
  app.get("*", (req, res, next) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
} else {
  app.get("*", (req, res, next) => {
    console.log("Catch-All in app.js");
    res.status(404).end();
  });
}

module.exports = app;

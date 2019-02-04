const express = require("express");
const router = express.Router();
const path = require("path");
const passport = require("passport");

const {
  populateDatabase
} = require("../database/functions/database-functions");

const isAdmin = function(req, res, next) {
  if (req.isAuthenticated()) {
    console.log(req);
    if (req.user.isAdmin) {
      next();
    }
  } else {
    res.redirect("/admin/login");
  }
};

//GET route for populating database:
router.get("/populate-database", isAdmin, (req, res) => {
  populateDatabase()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.statusMessage = error;
      res.status(400).end();
    });
});

router.get("/dashboard", isAdmin, (req, res) => {
  res.sendFile(path.resolve(__dirname, "../admin.html"));
});

router.get("/login", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../login.html"));
});

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/admin/login" }),
  (req, res) => {
    res.redirect("/admin/dashboard");
  }
);

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/admin/login");
});

router.get("*", (req, res, next) => {
  console.log("Catch-All in routes/admin.js");
  res.status(404).end();
});

module.exports = router;

/*
  Mongoose create() vs save():
  create() is a method called from the Model directly, save() is a method called on an instance of the model

  User.create({});
  -------------------------------
  newUser = new User({});
  newUser.save();
*/

//POST route for registering an admin
// router.post("/register", isAdmin, (req, res) => {
//   const { username, password } = req.body;
//   const newUser = new User({ username, password, isAdmin: true });
//   bcrypt.genSalt(10, (err, salt) => {
//     if (err) throw err;
//     bcrypt.hash(newUser.password, salt, (err, hash) => {
//       if (err) throw err;
//       newUser.password = hash;
//       newUser
//         .save()
//         .then(response => {
//           console.log("User successfully saved to database.");
//           res.status(200).send("Successfulyl registered user.");
//         })
//         .catch(error => {
//           console.log(error);
//           res.status(404).send("Failed to register user.");
//         });
//     });
//   });
// });

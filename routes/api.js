var express = require("express");
var router = express.Router();
const riotApiFunctions = require("../functions/riotAPI");
const { populateDatabase } = require("../functions/utility");
const { getCurrentPatch, getSummonerId, getActiveMatchData } = riotApiFunctions;

//GET active match data for Summoner:
router.get("/region/:region/summoner/:id", (req, res, next) => {
  res.send("Reached /region/:region/summoner/:id route");
});

//GET route for populating database:
router.get("/admin/populate-database", (req, res) => {
  console.log(populateDatabase);
  populateDatabase();
  res.send("Reached database population route.");
});

module.exports = router;

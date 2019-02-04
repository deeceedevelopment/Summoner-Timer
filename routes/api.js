const express = require("express");
const router = express.Router();

const { getActiveMatchData } = require("../functions/riotAPI");
const {
  getChampionData,
  getSummonerSpellData
} = require("../database/functions/database-functions");

router.get("/static-data", (req, res, next) => {
  const staticData = {};
  getChampionData()
    .then(response => {
      staticData.championData = response;
      return getSummonerSpellData();
    })
    .then(response => {
      staticData.summonerSpellData = response;
      res.status(200).send(staticData);
    })
    .catch(error => {
      res.status(404).end();
    });
});

//GET active match data for Summoner:
router.get("/active-match/region/:region/summoner/:name", (req, res, next) => {
  const { name, region } = req.params;
  getActiveMatchData(name, region)
    .then(response => {
      const players = response.participants || [];
      res.status(200).send(players);
    })
    .catch(error => {
      res.status(400).send(error);
    });
});

router.get("*", (req, res, next) => {
  console.log("Catch-All in routes/api.js");
  res.status(404).end();
});

module.exports = router;

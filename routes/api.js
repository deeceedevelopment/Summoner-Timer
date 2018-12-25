var express = require("express");
var router = express.Router();
const axios = require("axios");

const API_KEY = "RGAPI-7e2f1764-9484-4b5f-b2db-09d446baa565";

//get every champion ID and image URL, store in server memory

router.get("/summoner/:name", (req, res, next) => {
  //Get Summoner Name
  const summonerName = req.params.name;
  //Get Summoner ID
  axios
    .get(
      `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${
        req.params.name
      }?api_key=${API_KEY}`
    )
    .then(response => {
      const summonerId = response.data.id;
      axios
        .get(
          `https://na1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${summonerId}?api_key=${API_KEY}`
        )
        .then(response => {
          const data = response.data;
          const summoner = data.participants.filter(
            summoner => summoner.summonerId === summonerId
          );
          console.log(summoner);
          const summonerTeamID = summoner[0].teamId;
          console.log(summonerTeamID);
          const enemyTeam = data.participants.filter(
            summoner => summoner.teamId != summonerTeamID
          );
          res.send({ success: true, error: null, payload: enemyTeam });
        })
        .catch(error => {
          res.send({
            success: false,
            error: "Something went wrong.",
            payload: null
          });
        });
    })
    .catch(error => {
      res.send({
        success: false,
        error: "Something went wrong.",
        payload: null
      });
    });
  //Use Summoner ID to check for active match

  //send a response to the client
});

module.exports = router;

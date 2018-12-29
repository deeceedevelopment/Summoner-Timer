var express = require("express");
var router = express.Router();
const axios = require("axios");
const firebase = require("firebase");
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");
firebase.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://my-first-deploy-277b2.firebaseio.com"
});

const champions = {};
const API_KEY = "RGAPI-d3772cc2-1508-4e23-9cec-4b26db0448a5";
let CURRENT_PATCH = "";

//get every champion ID and image URL, store in server memory
axios
  .get("https://ddragon.leagueoflegends.com/api/versions.json")
  .then(response => {
    CURRENT_PATCH = response.data[0];
    //INITIALIZE CHAMPION IMAGE DATA
    axios
      .get(
        `http://ddragon.leagueoflegends.com/cdn/${CURRENT_PATCH}/data/en_US/champion.json`
      )
      .then(response => {
        //console.log(response.data.data);
        const championList = response.data.data;
        for (let champion in championList) {
          champions[championList[champion].key] = {
            imageURL: championList[champion].image.full,
            id: championList[champion].id,
            key: championList[champion].key
          };
        }
        console.log(champions);
      })
      .catch(error => {
        console.log(error);
      });
    //INITIALIZE SUMMONER SPELL IMAGE DATA + DURATION DATA
  })
  .catch(error => {
    console.log(error);
  });

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
          const summonerTeamID = summoner[0].teamId;
          const enemyTeam = data.participants.filter(
            summoner => summoner.teamId != summonerTeamID
          );
          const enemyData = enemyTeam.map(enemy => {
            const withImage = { ...enemy };
            withImage.imageURL = `http://ddragon.leagueoflegends.com/cdn/${CURRENT_PATCH}/img/champion/${
              champions[withImage.championId].imageURL
            }`;
            withImage.spell1ImgUrl = `http://ddragon.leagueoflegends.com/cdn/${CURRENT_PATCH}/img/spell/SummonerFlash.png`;
            withImage.spell2ImgUrl = `http://ddragon.leagueoflegends.com/cdn/${CURRENT_PATCH}/img/spell/SummonerMana.png`;
            return withImage;
          });
          //INITIALIZE A FIRE BASE ROOM AND SEND THE ID OF THE ROOM TO CLIENT FOR CONNECTION
          firebase
            .database()
            .ref("rooms")
            .push(enemyData)
            .then(response => {
              const roomId = response.key;
              res.send({
                success: true,
                error: null,
                payload: { roomId: roomId }
              });
            })
            .catch(error => {
              res.send({
                success: false,
                error: "Something went wrong creating Firebase Room",
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

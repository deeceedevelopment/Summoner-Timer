const axios = require("axios");

const API_KEY = "RGAPI-f6922add-fe58-4f14-a8bf-f5a3a6ea76fc";

module.exports = {
  getCurrentPatch: function() {
    return new Promise((resolve, reject) => {
      axios
        .get("https://ddragon.leagueoflegends.com/api/versions.json")
        .then(response => {
          const currentPatch = response.data[0];
          resolve(currentPatch);
        })
        .catch(error => {
          reject("ERROR: Failed to get current patch.");
        });
    });
  },
  getChampionData: function(currentPatch) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `http://ddragon.leagueoflegends.com/cdn/${currentPatch}/data/en_US/champion.json`
        )
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject("ERROR: Failed to get champion data.");
        });
    });
  },
  getSummonerId: function(summonerName, region) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`
        )
        .then(response => {
          resolve(response.data.id);
        })
        .catch(error => {
          const responseCode = error.response.data.status.status_code;
          if (responseCode === 404) {
            reject("Summoner not found.");
          } else {
            reject("Something went wrong.");
          }
        });
    });
  },
  getActiveMatchData: function(summonerId, region) {
    return new Promise((resolve, reject) => {
      reject("Haha fucked upppp!");
      //   axios
      //     .get(
      //       `https://${region}.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${summonerId}?api_key=${API_KEY}`
      //     )
      //     .then(response => {
      //       resolve(response.data);
      //     })
      //     .catch(error => {
      //       reject(
      //         "ERROR: Failed to get active match data based on summoner Id and region."
      //       );
      //     });
    });
  }
};

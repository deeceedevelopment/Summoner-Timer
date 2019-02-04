const axios = require("axios");

const { inputValid } = require("./utility");

const API_KEY = "RGAPI-13146688-c412-4603-97dd-cdef51c3cd71";

function getSummonerId(summonerName, region) {
  console.log("getSummonerId()");
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`
      )
      .then(response => {
        resolve(response.data.id);
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 403) {
            reject("Rate Limited by Riot API.");
          }
          if (error.response.status === 404) {
            reject("This summoner does not exist.");
          }
        } else if (error.request) {
          reject("This regional endpoint does not exist.");
        } else {
          reject("Something else went wrong.");
        }
      });
  });
}

function checkActiveMatch(summonerId, region) {
  console.log("checkActiveMatch()");
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://${region}.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${summonerId}?api_key=${API_KEY}`
      )
      .then(response => {
        console.log("Resolving checkActiveMatch()s Promise");
        resolve(response.data);
      })
      .catch(error => {
        console.log("Rejecting checkActiveMatch()s Promise");
        reject("This summoner is not in an active match.");
      });
  });
}

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
          resolve(response.data.data);
        })
        .catch(error => {
          reject("ERROR: Failed to get champion data.");
        });
    });
  },
  getSummonerSpellData: function(currentPatch) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `http://ddragon.leagueoflegends.com/cdn/${currentPatch}/data/en_US/summoner.json`
        )
        .then(response => {
          resolve(response.data.data);
        })
        .catch(error => {
          reject("ERROR: Failed to get summoner spell data.");
        });
    });
  },
  getActiveMatchData: function(summonerName, region) {
    console.log("getActiveMatchData()");
    if (!inputValid(summonerName, region)) {
      return Promise.reject("Input invalid.");
    }
    return new Promise((resolve, reject) => {
      getSummonerId(summonerName, region)
        .then(response => {
          return checkActiveMatch(response, region);
        })
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          console.log("CAUGHT error in getActiveMatchData()");
          console.log(error);
          reject(error);
        });
    });
  }
};

//create a function to abstract the promise chain out of the API file:

/*
  Function: getMatchData()
        - checks if summoner exists by name
        - finds summoner's ID if they do
        - checks if an active game exists by ID
        - takes that response and builds a front-end object if it does

        - returns new Promise()
        - immediately call getSummonerId()
        - THEN get activeMatch()
        - THEN build response object, RESOLVE response object
        - CATCH an error from any of the previous steps
*/

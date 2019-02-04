const Champions = require("../models/champions");
const SummonerSpells = require("../models/summonerSpells");
const {
  getCurrentPatch,
  getChampionData,
  getSummonerSpellData
} = require("../../functions/riotAPI");
const {
  buildChampionObject,
  buildSummonerSpellObject
} = require("../../functions/utility");

/*
  TO DO:
  1. [x] build getSummonerSpellData function in riotAPI.js
  2. [x] in populateDatabase's promise chain, call getSummonerSpellData(currentPatch)
  3. [x] use the summonerSpellData within the updateSummonerSpells database function
      - (optionally) create data first before using update
      - (mandatory) create a buildSummonerSpellsObject function within functions/utility.js
*/

function updateChampions(response) {
  return new Promise((resolve, reject) => {
    const championObject = buildChampionObject(response);
    Champions.findOneAndUpdate(
      {},
      { data: championObject },
      (err, updatedDocument) => {
        if (err) {
          reject("Error while updating Champions in database.");
        } else {
          resolve();
        }
      }
    );
  });
}

function updateSummonerSpells(response) {
  return new Promise((resolve, reject) => {
    const summonerSpellObject = buildSummonerSpellObject(response);
    SummonerSpells.findOneAndUpdate(
      {},
      { data: summonerSpellObject },
      (err, createdDocument) => {
        if (err) {
          reject("Error while updating Summoner Spells in database.");
        } else {
          resolve();
        }
      }
    );
  });
}

module.exports = {
  populateDatabase: function() {
    return new Promise((resolve, reject) => {
      let currentPatch;
      getCurrentPatch()
        .then(response => {
          currentPatch = response;
          return getChampionData(currentPatch);
        })
        .then(response => {
          return updateChampions(response);
        })
        .then(response => {
          return getSummonerSpellData(currentPatch);
        })
        .then(response => {
          return updateSummonerSpells(response);
        })
        .then(response => {
          resolve(
            `Database was successfully populated for patch ${currentPatch}`
          );
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  getChampionData: function() {
    return new Promise((resolve, reject) => {
      Champions.findOne({}, (err, foundDocument) => {
        if (err) {
          reject("Failed to find Champions in database.");
        } else {
          resolve(foundDocument);
        }
      });
    });
  },
  getSummonerSpellData: function() {
    return new Promise((resolve, reject) => {
      SummonerSpells.findOne({}, (err, foundDocument) => {
        if (err) {
          reject("Failed to find Summoner Spells in database.");
        } else {
          resolve(foundDocument);
        }
      });
    });
  }
};

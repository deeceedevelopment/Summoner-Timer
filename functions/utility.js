module.exports = {
  buildChampionObject: function(data) {
    const championObject = {};
    for (const champion in data) {
      championObject[data[champion].key] = data[champion].image.full;
    }
    return championObject;
  },
  buildSummonerSpellObject: function(data) {
    const summonerSpellObject = {};
    for (const summonerSpell in data) {
      const summonerSpellData = data[summonerSpell];
      summonerSpellObject[summonerSpellData.key] = {
        imageUrl: summonerSpellData.image.full,
        cooldown: summonerSpellData.cooldownBurn
      };
    }
    return summonerSpellObject;
  },
  inputValid: function(name, region) {
    validRegions = ["na1", "eun1", "euw1"];
    if (!validRegions.includes(region)) {
      return false;
    }
    if (name.length <= 0 || name.length > 16) {
      return false;
    }
    const summonerNameRegex = /^[a-zA-Z0-9\s]+$/;
    if (!name.match(summonerNameRegex)) {
      return false;
    }
    return true;
  }
};

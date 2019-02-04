const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const summonerSpellsSchema = new Schema({
  data: Object
});

module.exports = mongoose.model("SummonerSpells", summonerSpellsSchema);

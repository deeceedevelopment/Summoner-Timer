const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const championsSchema = new Schema({
  data: Object
});

module.exports = mongoose.model("Champions", championsSchema);

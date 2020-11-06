const { Schema, model } = require("mongoose");

const schema = new Schema({
  id: {},
  question: {},
});

module.exports = model("questions", schema);

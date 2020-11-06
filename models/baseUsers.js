const { Schema, model } = require("mongoose");

const schema = new Schema({
  userId: {},
  score: {},
  userName: {},
});

module.exports = model("users", schema);

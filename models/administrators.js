const { Schema, model } = require("mongoose");

const schema = new Schema({
  userId: {},
  login: {},
  password: {},
});

module.exports = model("administrators", schema);

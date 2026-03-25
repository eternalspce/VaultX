// models/Vault.js
const mongoose = require("mongoose");

const vaultSchema = new mongoose.Schema({
  userId: String,
  platform: String,
  username: String,
  password: String
});

module.exports = mongoose.model("Vault", vaultSchema);
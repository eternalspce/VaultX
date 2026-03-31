const mongoose = require("mongoose");

const vaultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  platform: String,
  username: String,
  password: String,
  iv: String
});

module.exports = mongoose.model("Vault", vaultSchema);
const mongoose = require("mongoose");

const vaultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  platform: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  username: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  password: {
    type: String,
    required: true,
    maxlength: 200
  },
  iv: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Vault", vaultSchema);
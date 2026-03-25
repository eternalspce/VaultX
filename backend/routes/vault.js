// routes/vault.js
const router = require("express").Router();
const Vault = require("../models/Vault");
const auth = require("../middleware/auth");

// Add
router.post("/", auth, async (req, res) => {
  const { platform, username, password } = req.body;

  const item = new Vault({
    userId: req.userId,
    platform,
    username,
    password
  });

  await item.save();
  res.json(item);
});

// Get all
router.get("/", auth, async (req, res) => {
  const data = await Vault.find({ userId: req.userId });
  res.json(data);
});

// Delete
router.delete("/:id", auth, async (req, res) => {
  await Vault.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

module.exports = router;
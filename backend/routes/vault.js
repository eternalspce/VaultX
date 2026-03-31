const router = require("express").Router();
const Vault = require("../models/Vault");
const auth = require("../middleware/auth");
const { encrypt, decrypt } = require("../utils/encryption");

// Add item
router.post("/", auth, async (req, res) => {
  try {
    const { platform, username, password } = req.body;

    const { encryptedData, iv } = encrypt(password);

    const item = new Vault({
      userId: req.userId,
      platform,
      username,
      password: encryptedData,
      iv
    });

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).send("Error saving item");
  }
});

// Get all items
router.get("/", auth, async (req, res) => {
  try {
    const data = await Vault.find({ userId: req.userId });

    const decryptedData = data.map(item => {
      try {
        if (!item.iv || !item.password) {
          return {
            ...item._doc,
            password: "⚠️ Invalid data"
          };
        }

        return {
          ...item._doc,
          password: decrypt(item.password, item.iv)
        };
      } catch (err) {
        return {
          ...item._doc,
          password: "❌ Decryption failed"
        };
      }
    });

    res.json(decryptedData);
  } catch (err) {
    console.log("VAULT ERROR:", err.message);
    res.status(500).send("Error fetching data");
  }
});

// Delete item
router.delete("/:id", auth, async (req, res) => {
  try {
    const item = await Vault.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!item) return res.status(404).send("Not found");

    res.send("Deleted successfully");
  } catch (err) {
    res.status(500).send("Error deleting");
  }
});

module.exports = router;
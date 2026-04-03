const router = require("express").Router();
const Vault = require("../models/Vault");
const auth = require("../middleware/auth");
const { validateVault, handleValidationErrors } = require("../middleware/validation");
const { encrypt, decrypt } = require("../utils/encryption");
const logger = require("../utils/logger");

// Helper function to decrypt vault items
const decryptVaultItems = (items) => {
  return items.map(item => {
    try {
      if (!item.iv || !item.password) {
        return {
          ...item._doc,
          password: "⚠️ Invalid encrypted data"
        };
      }
      return {
        ...item._doc,
        password: decrypt(item.password, item.iv)
      };
    } catch (err) {
      logger.error("Vault decryption error", { itemId: item._id, error: err.message });
      return {
        ...item._doc,
        password: "❌ Decryption failed"
      };
    }
  });
};

// Add item
router.post("/", auth, validateVault, handleValidationErrors, async (req, res) => {
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
    
    logger.info("Vault item created", { userId: req.userId, platform, itemId: item._id });
    res.status(201).json({
      _id: item._id,
      platform: item.platform,
      username: item.username,
      password: password,
      createdAt: item.createdAt
    });
  } catch (err) {
    logger.error("Add vault item error", { userId: req.userId, error: err.message });
    res.status(500).json({ error: "Failed to save entry" });
  }
});

// Get all items
router.get("/", auth, async (req, res) => {
  try {
    const data = await Vault.find({ userId: req.userId }).sort({ createdAt: -1 });
    const decryptedData = decryptVaultItems(data);
    
    logger.debug("Vault items retrieved", { userId: req.userId, count: data.length });
    res.json(decryptedData);
  } catch (err) {
    logger.error("Get vault items error", { userId: req.userId, error: err.message });
    res.status(500).json({ error: "Failed to fetch entries" });
  }
});

// Get single item
router.get("/:id", auth, async (req, res) => {
  try {
    const item = await Vault.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!item) {
      logger.warn("Vault item not found", { userId: req.userId, itemId: req.params.id });
      return res.status(404).json({ error: "Entry not found" });
    }

    const decrypted = decryptVaultItems([item])[0];
    res.json(decrypted);
  } catch (err) {
    logger.error("Get vault item error", { userId: req.userId, itemId: req.params.id, error: err.message });
    res.status(500).json({ error: "Failed to fetch entry" });
  }
});

// Update item
router.put("/:id", auth, validateVault, handleValidationErrors, async (req, res) => {
  try {
    const { platform, username, password } = req.body;
    const { encryptedData, iv } = encrypt(password);

    const item = await Vault.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { platform, username, password: encryptedData, iv },
      { new: true, runValidators: true }
    );

    if (!item) {
      logger.warn("Vault item not found for update", { userId: req.userId, itemId: req.params.id });
      return res.status(404).json({ error: "Entry not found" });
    }

    logger.info("Vault item updated", { userId: req.userId, itemId: req.params.id, platform });
    res.json({
      _id: item._id,
      platform: item.platform,
      username: item.username,
      password: password,
      updatedAt: item.updatedAt
    });
  } catch (err) {
    logger.error("Update vault item error", { userId: req.userId, itemId: req.params.id, error: err.message });
    res.status(500).json({ error: "Failed to update entry" });
  }
});

// Delete item
router.delete("/:id", auth, async (req, res) => {
  try {
    const item = await Vault.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!item) {
      logger.warn("Vault item not found for deletion", { userId: req.userId, itemId: req.params.id });
      return res.status(404).json({ error: "Entry not found" });
    }

    logger.info("Vault item deleted", { userId: req.userId, itemId: req.params.id });
    res.json({ message: "Entry deleted successfully" });
  } catch (err) {
    logger.error("Delete vault item error", { userId: req.userId, itemId: req.params.id, error: err.message });
    res.status(500).json({ error: "Failed to delete entry" });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const Member = require("../models/Member");

// Neuen Member anlegen oder vorhandenen aktualisieren
router.post("/", async (req, res) => {
  const { account_id } = req.body;

  if (!account_id) {
    return res.status(400).json({ error: "account_id ist erforderlich." });
  }

  try {
    const member = await Member.findOneAndUpdate(
      { account_id },
      { $set: req.body },
      { new: true, upsert: true } // falls nicht vorhanden, erstellen
    );
    res.status(200).json(member);
  } catch (err) {
    console.error("❌ Fehler beim Speichern:", err);
    res.status(500).json({ error: "Fehler beim Speichern." });
  }
});

// Alle Member abrufen
router.get("/", async (_req, res) => {
  try {
    const members = await Member.find();
    res.status(200).json(members);
  } catch (err) {
    console.error("❌ Fehler beim Abrufen der Mitglieder:", err);
    res.status(500).json({ error: "Fehler beim Abrufen der Mitglieder." });
  }
});

// Einzelnes Member-Profil anhand der account_id abrufen
router.get("/by-id/:account_id", async (req, res) => {
    console.log("🔍 Anfrage für Account ID:", req.params.account_id);
  
    try {
      const member = await Member.findOne({ account_id: req.params.account_id });
      if (!member) {
        console.log("❗ Kein Member gefunden.");
        return res.status(404).json({ error: "Member nicht gefunden." });
      }
  
      console.log("✅ Member gefunden:", member);
      res.status(200).json(member);
    } catch (err) {
      console.error("❌ Fehler beim Abrufen:", err);
      res.status(500).json({ error: "Interner Serverfehler." });
    }
  });

module.exports = router;
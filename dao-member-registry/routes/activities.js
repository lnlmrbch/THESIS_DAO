const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");

// =====================
// ACTIVITIES ROUTES
// =====================
// Diese Datei enthält alle API-Endpunkte für die Verwaltung von Aktivitäten (z.B. Token-Käufe).
// - POST /api/activities: Neue Aktivität anlegen (nur Käufe erlaubt)
// - GET /api/activities: Letzte 50 Aktivitäten abrufen
// =====================

// Aktivität erstellen
router.post("/", async (req, res) => {
  try {
    const { accountId, type, description, timestamp } = req.body;

    // Nur Käufe erlauben
    if (type !== "buy") {
      return res.status(400).json({ message: "Nur Käufe können als Aktivität gespeichert werden." });
    }

    const activity = new Activity({
      accountId,
      type,
      description,
      timestamp: timestamp || new Date(),
    });

    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    console.error("Fehler beim Erstellen der Aktivität:", error);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
});

// Aktivitäten abrufen
router.get("/", async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(activities);
  } catch (error) {
    console.error("Fehler beim Abrufen der Aktivitäten:", error);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
});

module.exports = router;
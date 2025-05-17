const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const membersRouter = require("./routes/members");

const app = express();
const PORT = process.env.PORT || 5050;

// CORS korrekt konfigurieren
app.use(cors());

// Middleware
app.use(express.json());

// MongoDB Verbindung
mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("✅ MongoDB verbunden");

        // TEST
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("📦 Collections:", collections.map(c => c.name));
    })
    .catch((err) => console.error("❌ MongoDB Fehler:", err));

// API-Routen
app.use("/api/members", membersRouter);

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});

app.get("/test", (_req, res) => {
    res.status(200).json({ message: "Server antwortet korrekt." });
});

const activitiesRouter = require("./routes/activities");
app.use("/api/activities", activitiesRouter);
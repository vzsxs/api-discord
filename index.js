require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 🔥 MONGO SETUP
const client = new MongoClient(process.env.MONGO_URI);
let db;

// conectar Mongo
async function connectDB() {
  try {
    await client.connect();
    db = client.db("api-discordia"); // nombre de tu DB
    console.log("🚀 Mongo conectado");
  } catch (err) {
    console.error("❌ Error Mongo:", err);
  }
}

connectDB();

// -------------------
// 🧠 GUARDAR PERFIL
// -------------------
app.post("/profile", async (req, res) => {
  try {
    const { robloxUserId, robloxUsername, roleTag } = req.body;

    if (!robloxUserId) {
      return res.status(400).json({ ok: false, error: "missing robloxUserId" });
    }

    await db.collection("profiles").updateOne(
      { robloxUserId },
      {
        $set: {
          robloxUserId: String(robloxUserId),
          robloxUsername: robloxUsername || "",
          roleTag: roleTag || "Civil",
        },
      },
      { upsert: true }
    );

    console.log("💾 Guardado en Mongo:", robloxUserId);

    res.json({ ok: true });
  } catch (err) {
    console.error("❌ Error /profile:", err);
    res.status(500).json({ ok: false });
  }
});

// -------------------
// 📥 LEER PERFIL
// -------------------
app.get("/profile/:id", async (req, res) => {
  try {
    const user = await db.collection("profiles").findOne({
      robloxUserId: req.params.id,
    });

    if (!user) {
      return res.json({ ok: false });
    }

    res.json({ ok: true, profile: user });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
});

// -------------------
// 🚀 START SERVER
// -------------------
app.listen(PORT, () => {
  console.log(`🚀 API lista en puerto ${PORT}`);
});
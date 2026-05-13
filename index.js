require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 🧠 memoria (base de datos simple)
const database = {};

// -------------------
// 💾 GUARDAR PERFIL
// -------------------
app.post("/profile", (req, res) => {
  const { robloxUserId, robloxUsername, roleTag } = req.body;

  if (!robloxUserId) {
    return res.status(400).json({ ok: false, error: "missing robloxUserId" });
  }

  database[robloxUserId] = {
    robloxUserId: String(robloxUserId),
    robloxUsername: robloxUsername || "",
    roleTag: roleTag || "Civil",
  };

  console.log("💾 Guardado:", database[robloxUserId]);

  res.json({
    ok: true,
    profile: database[robloxUserId],
  });
});

// -------------------
// 📥 OBTENER PERFIL
// -------------------
app.get("/profile/:id", (req, res) => {
  const user = database[req.params.id];

  if (!user) {
    return res.json({ ok: false });
  }

  res.json({ ok: true, profile: user });
});

// -------------------
// 🚀 START SERVER
// -------------------
app.listen(PORT, () => {
  console.log(`🚀 API lista en puerto ${PORT}`);
});
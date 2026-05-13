const express = require("express");
const app = express();

app.use(express.json());

// “base de datos” simple en memoria
const database = {};

// Guardar perfil
app.post("/profile", (req, res) => {
  const { robloxUserId, robloxUsername, roleTag } = req.body;

  if (!robloxUserId) {
    return res.status(400).json({ ok: false, error: "missing robloxUserId" });
  }

  database[robloxUserId] = {
    robloxUserId,
    robloxUsername,
    roleTag
  };

  res.json({ ok: true, profile: database[robloxUserId] });
});

// Leer perfil
app.get("/profile/:id", (req, res) => {
  const data = database[req.params.id];

  if (!data) {
    return res.json({ ok: false });
  }

  res.json({ ok: true, profile: data });
});

// IMPORTANTE para Render
app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 API corriendo");
});
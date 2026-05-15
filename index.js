require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// base de datos simple en memoria
const database = {};

// guardar perfil
app.post("/profile", (req, res) => {
  const { robloxUserId, robloxUsername, discordName, roleTag } = req.body;

  if (!robloxUserId) {
    return res.status(400).json({ ok: false, error: "missing robloxUserId" });
  }

  database[String(robloxUserId)] = {
    robloxUserId: String(robloxUserId),
    robloxUsername: robloxUsername || "",
    discordName: discordName || "",
    roleTag: roleTag || "Civil"
  };

  console.log("💾 Guardado:", database[String(robloxUserId)]);

  res.json({
    ok: true,
    profile: database[String(robloxUserId)]
  });
});

// leer perfil
app.get("/profile/:id", (req, res) => {
  const user = database[String(req.params.id)];

  if (!user) {
    return res.json({ ok: false });
  }

  res.json({
    ok: true,
    profile: user
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API lista en puerto ${PORT}`);
});

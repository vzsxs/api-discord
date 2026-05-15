require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

// Base de datos en memoria
const database = {};

// Ruta principal para que Render detecte el puerto
app.get("/", (req, res) => {
  res.send("API ONLINE");
});

// Guardar perfil
app.post("/profile", (req, res) => {
  const { robloxUserId, robloxUsername, discordName, roleTag } = req.body;

  if (!robloxUserId) {
    return res.status(400).json({
      ok: false,
      error: "missing robloxUserId"
    });
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

// Leer perfil
app.get("/profile/:id", (req, res) => {
  const data = database[String(req.params.id)];

  if (!data) {
    return res.json({
      ok: false
    });
  }

  res.json({
    ok: true,
    profile: data
  });
});

// Puerto de Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API lista en puerto ${PORT}`);
});

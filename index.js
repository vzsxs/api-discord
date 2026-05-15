require("dotenv").config();
const express = require("express");

const app = express();

app.use(express.json());

const database = {};

app.get("/", (req, res) => {
  res.send("API ONLINE");
});

app.post("/profile", (req, res) => {
  const { robloxUserId, robloxUsername, discordName, roleTag } = req.body;

  database[String(robloxUserId)] = {
    robloxUserId,
    robloxUsername,
    discordName,
    roleTag
  };

  console.log("💾 Guardado:", database[String(robloxUserId)]);

  res.json({
    ok: true
  });
});

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

-- 🔥 IMPORTANTE
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 API lista en puerto", PORT);
});

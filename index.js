const express = require("express");
const fs = require("node:fs");
const path = require("node:path");

const app = express();
app.use(express.json());

const DB_FILE = path.join(__dirname, "database.json");

let database = {};

// ================= CARGAR DB =================
function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf8");
      database = raw ? JSON.parse(raw) : {};
      console.log("✅ Base cargada");
    } else {
      database = {};
      console.log("🆕 Nueva base creada");
    }
  } catch (err) {
    console.error("❌ Error cargando DB:", err);
    database = {};
  }
}

// ================= GUARDAR DB =================
function saveDatabase() {
  try {
    fs.writeFileSync(
      DB_FILE,
      JSON.stringify(database, null, 2),
      "utf8"
    );
  } catch (err) {
    console.error("❌ Error guardando DB:", err);
  }
}

loadDatabase();

// ================= POST PROFILE =================
app.post("/profile", (req, res) => {
  const { robloxUserId, robloxUsername, roleTag } = req.body;

  if (!robloxUserId) {
    return res.status(400).json({
      ok: false,
      error: "missing robloxUserId"
    });
  }

  database[String(robloxUserId)] = {
    robloxUserId: String(robloxUserId),
    robloxUsername: robloxUsername || "",
    roleTag: roleTag || "Civil"
  };

  saveDatabase();

  console.log("💾 Guardado:", database[String(robloxUserId)]);

  res.json({
    ok: true,
    profile: database[String(robloxUserId)]
  });
});

// ================= GET PROFILE =================
app.get("/profile/:robloxUserId", (req, res) => {
  const user = database[String(req.params.robloxUserId)];

  if (!user) {
    return res.json({ ok: false });
  }

  res.json({
    ok: true,
    profile: user
  });
});

// ================= START =================
app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 API lista");
});
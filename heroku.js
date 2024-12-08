/*const express = require("express");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  Browsers,
  makeInMemoryStore,
} = require("@whiskeysockets/baileys");
const fs = require("fs");
const { serialize } = require("./lib/serialize");
const { Message } = require("./lib/Base");
const pino = require("pino");
const path = require("path");
const events = require("./lib/event");
const got = require("got");
const config = require("./config");
const { PluginDB } = require("./lib/database/plugins");
const Greetings = require("./lib/Greetings");
const { File } = require("megajs");

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for JSON parsing (if needed)
app.use(express.json());

// Create in-memory store
const store = makeInMemoryStore({
  logger: pino().child({ level: "silent", stream: "store" }),
});

require("events").EventEmitter.defaultMaxListeners = 50;

// Setup the main functionality
async function initializeSession() {
  const output = "./lib/session/";
  const pth = output + "creds.json";
  const prefix = "Nikka-X";

  try {
    if (!fs.existsSync(pth)) {
      if (!config.SESSION_ID.startsWith(prefix)) {
        throw new Error("Invalid session ID.");
      }

      const url = "https://mega.nz/file/" + config.SESSION_ID.replace(prefix, "");
      const file = File.fromURL(url);
      await file.loadAttributes();

      if (!fs.existsSync(output)) {
        fs.mkdirSync(output, { recursive: true });
      }

      const data = await file.downloadBuffer();
      fs.writeFileSync(pth, data);
    }
  } catch (error) {
    console.error("Error initializing session:", error);
  }
}

// Read and load plugins
fs.readdirSync("./lib/database/").forEach((plugin) => {
  if (path.extname(plugin).toLowerCase() === ".js") {
    require("./lib/database/" + plugin);
  }
});

async function Abhiy() {
  console.log("Syncing Database");
  await config.DATABASE.sync();

  const { state, saveCreds } = await useMultiFileAuthState(
    "./lib/session",
    pino({ level: "silent" })
  );

  let conn = makeWASocket({
    logger: pino({ level: "silent" }),
    auth: state,
    printQRInTerminal: true,
    browser: Browsers.macOS("Desktop"),
    downloadHistory: false,
    syncFullHistory: false,
  });

  store.bind(conn.ev);

  setInterval(() => {
    store.writeToFile("./lib/store_db.json");
    console.log("Saved store");
  }, 30 * 60 * 1000);

  // Connection events and handlers
  conn.ev.on("connection.update", async (s) => {
    const { connection, lastDisconnect } = s;

    if (connection === "connecting") {
      console.log("Connecting session...");
    }

    if (connection === "close" && lastDisconnect?.error?.output?.statusCode !== 401) {
      console.log(lastDisconnect.error.output.payload);
      Abhiy(); // Reconnect
    }

    if (connection === "open") {
      console.log("Login successful ✅");

      // Install plugins dynamically
      let plugins = await PluginDB.findAll();
      plugins.forEach(async (plugin) => {
        if (!fs.existsSync(`./plugins/${plugin.dataValues.name}.js`)) {
          console.log(`Installing plugin: ${plugin.dataValues.name}`);
          const response = await got(plugin.dataValues.url);
          if (response.statusCode === 200) {
            fs.writeFileSync(`./plugins/${plugin.dataValues.name}.js`, response.body);
            require(`./plugins/${plugin.dataValues.name}.js`);
          }
        }
      });

      console.log("Plugins installed ✅");

      fs.readdirSync("./plugins").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() === ".js") {
          require(`./plugins/${plugin}`);
        }
      });
    }

    conn.ev.on("creds.update", saveCreds);

    // Group events handler
    conn.ev.on("group-participants.update", async (data) => {
      // Handle group participant events here (e.g., welcome/goodbye messages)
    });

    // Message events handler
    conn.ev.on("messages.upsert", async (m) => {
      if (m.type !== "notify") return;
      const msg = await serialize(JSON.parse(JSON.stringify(m.messages[0])), conn);

      if (!msg.message) return;

      // Process commands
      events.commands.forEach(async (command) => {
        // Command processing logic
      });
    });
  });

  process.on("uncaughtException", async (err) => {
    console.error("Unhandled exception:", err);
  });
}

// Route for status check
app.get("/", (req, res) => {
  res.send("Server is running. Nikka-X is active.");
});

// Start the WhatsApp bot after initializing session
initializeSession().then(() => {
  Abhiy();
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
*/

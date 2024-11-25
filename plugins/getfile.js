const { command, isPrivate } = require("../lib");
const fs = require("fs");
const path = require("path");

command(
  {
    pattern: "getfile",
    fromMe: isPrivate,
    desc: "Retrieve a file from the plugins folder.",
    type: "utility",
  },
  async (message, match) => {
    try {
      // Check if a file name is provided
      if (!match) {
        return await message.reply("*Please specify the file name, e.g., `.getfile filename.js`.*");
      }

      // Define the path to the plugins folder
      const filePath = path.resolve("./plugins", match.trim());

      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        return await message.reply(`*File not found: ${match.trim()}*`);
      }

      // Send the file
      await message.client.sendMessage(
        message.jid,
        {
          document: fs.readFileSync(filePath),
          fileName: match.trim(),
          mimetype: "application/octet-stream",
        },
        { quoted: message }
      );

      // Confirm successful sending
      await message.reply(`*File sent successfully: ${match.trim()}*`);
    } catch (error) {
      console.error("Error retrieving file:", error);
      await message.reply("*Failed to retrieve the file. Please check the file name and try again.*");
    }
  }
);

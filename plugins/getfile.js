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
command(
  {
    pattern: "listfiles",
    fromMe: isPrivate,
    desc: "Lists all .js files in the plugins folder.",
    type: "utility",
  },
  async (message) => {
    try {
      // Define the plugins folder path
      const pluginsPath = path.resolve("./plugins");

      // Check if the folder exists
      if (!fs.existsSync(pluginsPath)) {
        return await message.reply("*Plugins folder not found.*");
      }

      // Read all files in the plugins directory
      const files = fs.readdirSync(pluginsPath);

      // Filter files to only include .js files
      const jsFiles = files.filter((file) => file.endsWith(".js"));

      // Check if there are any .js files
      if (jsFiles.length === 0) {
        return await message.reply("*No files found in the plugins folder.*");
      }

      // Create a formatted list of the files
      const fileList = jsFiles.map((file, index) => `${index + 1}. ${file}`).join("\n");

      // Send the list to the user
      await message.reply(`*Available files in plugins folder:*\n\n${fileList}`);
    } catch (error) {
      console.error("Error listing files:", error);
      await message.reply(`*Failed to list files. Error: ${error.message}*`);
    }
  }
);

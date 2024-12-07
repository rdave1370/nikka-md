const { command, getJson } = require("../lib/");

const apiKey = "nikka"; // API key for the search
const searchApi = "https://nikka-api.us.kg/search/yts?q="; // Search API URL
const downloadApi = "https://api.siputzx.my.id/api/d/ytmp3?url=https://youtube.com/watch?v="; // Download API URL
const imageUrl = "https://files.catbox.moe/flinnf.jpg"; // Developer image
const thumbnailUrl = "https://files.catbox.moe/cuu1aa.jpg"; // Thumbnail image

// Search command to find songs based on the user's query
command(
  {
    pattern: "song ?(.*)",
    fromMe: false,
    desc: "Search for songs using a keyword and download the first result",
    type: "search",
  },
  async (message, match) => {
    try {
      const query = match.trim();
      if (!query) return message.reply("Please provide a search query.\nExample: `.search Shape of You`");

      const apiUrl = `${searchApi}${encodeURIComponent(query)}&apiKey=${apiKey}`;
      const response = await getJson(apiUrl);

      const results = response?.data || [];
      if (results.length === 0) {
        return message.reply("No results found for your query.");
      }

      // Automatically get the first result's videoId
      const firstResult = results[0];
      const videoId = firstResult.videoId;

      // Send the search result with the image and thumbnail
      let responseMessage = `*Search Results for "${query}":*\n\n`;
      responseMessage += `1. *${firstResult.title}*\n   - Duration: ${firstResult.duration.timestamp}\n   - Views: ${firstResult.views.toLocaleString()} views\n   - By: ${firstResult.author.name}\n\n`;
      responseMessage += "Downloading the first result...";

      await message.client.sendMessage(message.jid, {
        image: { url: imageUrl },
        caption: responseMessage,
        contextInfo: {
          externalAdReply: {
            title: `Search Result: ${firstResult.title}`,
            body: "First Result",
            sourceUrl: "https://haki.us.kg", // Link to your website
            mediaUrl: "https://haki.us.kg", // Additional URL
            mediaType: 4,
            showAdAttribution: true,
            renderLargerThumbnail: false,
            thumbnailUrl: thumbnailUrl,
          },
        },
      });

      // Fetch the download URL for the first result
      const downloadUrl = `${downloadApi}${videoId}`;
      const downloadResponse = await getJson(downloadUrl);

      // Check if the download response is valid
      if (downloadResponse.status) {
        const audioUrl = downloadResponse.data.dl;
        const audioTitle = downloadResponse.data.title;

        // Send the audio file to the user
        await message.client.sendMessage(message.jid, {
          audio: { url: audioUrl },
          caption: `*${audioTitle}*`,
          mimetype: "audio/mpeg",
        });
      } else {
        return message.reply("Error downloading the song. Please try again.");
      }
    } catch (error) {
      console.error(error);
      return message.reply("An error occurred while searching or downloading. Please try again.");
    }
  }
);

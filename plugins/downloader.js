const { command, isPrivate, getJson } = require("../lib/");

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





command(
    {
        pattern: "apk",
        desc: "Downloads APKs",
        fromMe: isPrivate,
        type: "user",
    },
    async (message, match) => {
        if (!match) {
            return await message.sendMessage("Please provide the app name to search.");
        }

        try {
            // Fetch APK details from the API
            const res = await getJson(
                `https://api.nexoracle.com/downloader/apk?apikey=free_key@maher_apis&q=${encodeURIComponent(match)}`
            );

            // Debugging API response
            console.log("API Response:", res);

            // Validate response
            if (!res || !res.result) {
                return await message.sendMessage(
                    "Could not find the APK details. Please check the app name and try again."
                );
            }

            const { name, lastup, size, dllink, icon } = res.result || {};

            // Check mandatory fields
            if (!dllink || !name || !size) {
                return await message.sendMessage(
                    "The APK details for the provided app are unavailable. Please try another app."
                );
            }

            const lastUpdate = lastup || "Not available";
            const apkIcon = icon || "https://files.catbox.moe/cuu1aa.jpg"; // Default icon

            // Prepare the response text
            const text = `
*📥 APK Downloader*

*Name:* ${name}
*Last Updated:* ${lastUpdate}
*Size:* ${size}

_Downloading the file. This may take some time._
            `;

            // Send the message with APK details
            await message.client.sendMessage(message.jid, {
                image: { url: apkIcon },
                caption: text.trim(),
                contextInfo: {
                    externalAdReply: {
                        title: "APK Download Service",
                        body: "Powered by Nikka-MD",
                        sourceUrl: "https://haki.us.kg", // Change this to your site
                        mediaUrl: "https://haki.us.kg",  // Change this to your site
                        mediaType: 4,
                        showAdAttribution: true,
                        renderLargerThumbnail: false,
                        thumbnail: { url: apkIcon }, // Thumbnail for externalAdReply
                    },
                },
            });

            // Send the APK file
            await message.client.sendMessage(
                message.jid,
                {
                    document: { url: dllink },
                    fileName: `${name}.apk`,
                    mimetype: "application/vnd.android.package-archive",
                },
                { quoted: message }
            );
        } catch (error) {
            console.error("Error fetching APK:", error);

            // Send user-friendly error message
            await message.sendMessage(
                "An error occurred while fetching the APK. Please try again later or contact support."
            );
        }
    }
);

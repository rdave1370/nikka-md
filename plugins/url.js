const {
  command,
  isPrivate,
  getBuffer
} = require("../lib/");
const axios = require('axios');
const FormData = require("form-data");
command(
  {
    pattern: "makeurl",
    fromMe: isPrivate,
    desc: "Upload an image, audio, or video file",
    type: "tools",
  },
  async (message, match, m) => {
    // Check if the user is replying to a message
    if (!message.reply_message) {
      return await message.reply("❗ Please reply to an image, video, or audio file to upload.");
    }

    // Check if the replied message contains valid media
    const isImage = message.reply_message.image;
    const isVideo = message.reply_message.video;
    const isAudio = message.reply_message.audio;
    const isSticker = message.reply_message.sticker;

    if (!isImage && !isVideo && !isAudio && !isSticker) {
      return await message.reply("❗ Please reply to a valid image, video, or audio file.");
    }

    // Download the file based on the type of media
    let buff = await m.quoted.download();

    // Determine the file extension based on the media type
    let extension = '';
    if (isImage) {
      extension = '.jpg'; // Default extension for images
    } else if (isVideo) {
      extension = '.mp4'; // Default extension for videos
    } else if (isAudio) {
      extension = '.mp3'; // Default extension for audio
    } else if (isSticker) {
      extension = '.webp'; // Default extension for stickers
    }

    // Prepare the FormData object to send to the API
    const formData = new FormData();
    formData.append('file', buff, { filename: 'file' + extension });

    try {
      // Make the API request to upload the file
      const response = await axios.post('https://itzpire.com/tools/upload', formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      // Handle the response from the API
      if (response.data.status === "success" && response.data.fileInfo && response.data.fileInfo.url) {
        let fileUrl = response.data.fileInfo.url;

        // Ensure the correct file extension is added to the URL
        if (!fileUrl.endsWith(extension)) {
          fileUrl += extension;
        }

        // Aesthetic and customized success message with thumbnail
        const successMessage = `
╔═════════════════✦═╗
║ 🎉 File Uploaded! 🎉  ║
╠═════════════════✦═╣
║  Platform: itzpire
╠═════════════════✦═╣
║ 📎 Link: ${fileUrl}  
╚═════════════════✦═╝`;

        // Send the upload result with the file URL and include a thumbnail
        await message.client.sendMessage(message.jid, {
          text: successMessage,
          contextInfo: {
            externalAdReply: {
              title: "Powered by Haki",
              body: "File Upload Service",
              sourceUrl: "https://whatsapp.com/channel/0029VaoLotu42DchJmXKBN3L",
              mediaUrl: fileUrl,
              mediaType: 1,
              showAdAttribution: true,
              renderLargerThumbnail: false,
              thumbnailUrl: "https://files.catbox.moe/mnp025.jpg", // Your thumbnail URL
            }
          }
        });

      } else {
        await message.reply("❗ Failed to upload the file. Please try again later.");
      }
    } catch (error) {
      console.error(error);
      await message.reply("❗ An error occurred while uploading the file. Please try again.");
    }
  }
);

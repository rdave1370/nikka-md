const {
  command,
  isPrivate,
  getBuffer
} = require("../lib/");
const axios = require('axios');
const FormData = require("form-data");
// https://api.nexoracle.com/search/google?apikey=free_key@maher_apis&q=who%20is%20Mark%20Zuckeberk
command(
  {
    pattern: "gojo",
    fromMe: false, // Anyone can use the command
    desc: "Fetch and send a Gojo anime video with a thumbnail.",
    type: "anime", // You can change this to any suitable type
  },
  async (message, match) => {
    try {
      // Fetch the video URL from the API
      const api = await axios.get('https://api.nexoracle.com/anime/yuji?apikey=free_key@maher_apis');
      
      // Extract the video URL from the API response
      const videoUrl = api.data.result;

      // Send the video using message.client.sendMessage with mimetype and thumbnail
      await message.client.sendMessage(message.jid, {
        video: { url: videoUrl },
        mimetype: "video/mp4", // Assuming the video is in mp4 format
        caption: ">Here is the yuji anime video you requested!",  // Optional caption
        contextInfo: {
          externalAdReply: {
            title: " Anime amv",
            body: "Enjoy the anime video",
            sourceUrl: "",
            mediaUrl: videoUrl,
            mediaType: 1, // Media type 1 indicates a video
            showAdAttribution: true,
            renderLargerThumbnail: false,
            thumbnailUrl: "https://files.catbox.moe/mnp025.jpg" // Your thumbnail image
          }
        }
      });
    } catch (error) {
      console.error("Error while fetching the video:", error);
      await message.reply("An error occurred while fetching the video.");
    }
  }
);


command(
  {
    pattern: "yuji",
    fromMe: false, // Anyone can use the command
    desc: "Fetch and send a Gojo anime video with a thumbnail.",
    type: "anime", // You can change this to any suitable type
  },
  async (message, match) => {
    try {
      // Fetch the video URL from the API
      const api = await axios.get('https://api.nexoracle.com/anime/yuji?apikey=free_key@maher_apis');
      
      // Extract the video URL from the API response
      const videoUrl = api.data.result;

      // Send the video using message.client.sendMessage with mimetype and thumbnail
      await message.client.sendMessage(message.jid, {
        video: { url: videoUrl },
        mimetype: "video/mp4", // Assuming the video is in mp4 format
        caption: "Here is the yuji anime video you requested!",  // Optional caption
        contextInfo: {
          externalAdReply: {
            title: " Anime amv",
            body: "Enjoy the anime video",
            sourceUrl: "",
            mediaUrl: videoUrl,
            mediaType: 1, // Media type 1 indicates a video
            showAdAttribution: true,
            renderLargerThumbnail: false,
            thumbnailUrl: "https://files.catbox.moe/mnp025.jpg" // Your thumbnail image
          }
        }
      });
    } catch (error) {
      console.error("Error while fetching the video:", error);
      await message.reply("An error occurred while fetching the video.");
    }
  }
)

let images = [
  "https://files.catbox.moe/fgq7tm.jpg",
  "https://files.catbox.moe/7bgscf.jpg",
  "https://files.catbox.moe/qxtquy.jpg",
  "https://files.catbox.moe/fgq7tm.jpg",
  "https://files.catbox.moe/ytdlgz.jpg"
];

command({
  pattern: "muzan ?(.*)",
  fromMe: isPrivate,
  desc: "Send a random image",
  type: "anime"
}, async (message, match, m, client) => {
  try {
    let img = images[Math.floor(Math.random() * images.length)]; // Select a random image
    let buff = await getBuffer(img); // Fetch the image as a buffer
    await message.client.sendMessage(message.jid, {
      'image': buff,
      'mimetype': "image/jpeg",
      'caption': "\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʜᴀᴋɪ",
      'contextInfo': {
        'externalAdReply': {
          'title': " 𝗠𝗨𝗭𝗔𝗡 𝗞𝗜𝗕𝗨𝗧𝗦𝗨𝗝𝗜",
          'body': "𝗡𝗶𝗸𝗸𝗮 𝗺𝗱",
          'sourceUrl': "",
          'mediaUrl': "",
          'mediaType': 1,
          'showAdAttribution': true,
          'renderLargerThumbnail': false,
          'thumbnailUrl': "https://files.catbox.moe/8s6w29.jpg"
        }
      }
    });
  } catch (error) {
    return message.reply(error);
  }
});

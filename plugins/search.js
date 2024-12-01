const { command, isPrivate, getJson } = require("../lib/");
const fetch = require("node-fetch");
const axios = require("axios");

command(
    {
        pattern: "sps",
        fromMe: isPrivate,
        desc: "spotify song searcher",
        type: "search",
    },
    async (message, match) => {
        if(!match) return await message.reply("*_Need Song Name_*");
var {result} = await getJson(`https://api.maher-zubair.tech/search/spotify?q=${match}`)
        let txxt = `*spotify search results*\n\n`;
      
        for (let i=1; i<6; i++){
  txxt+=`
> *TITLE* : ${result[i].title}
> *DURATION* : ${result[i].duration}
> *ARTIST* : ${result[i].artist}
> *POPULARITY* : ${result[i].popularity}
> *URL* : ${result[i].url}\n`
        }
                   await message.client.sendMessage(message.jid,{ document :{ url: "https://www.mediafire.com/file/n1qjfxjgvt0ovm2/IMG-20240211-WA0086_%25281%2529.pdf/file" }, fileName: "𝗦𝗣𝗢𝗧𝗜𝗙𝗬 𝗦𝗘𝗔𝗥𝗖𝗛 𝗠𝗘𝗡𝗨" , mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileLength: "999999950", caption: (txxt)}, {quoted: message })
    }
    );

command(
    {
        pattern: "gitinfo",
        fromMe: isPrivate,
        desc: "github user details",
        type: "search",
    },
    async (message, match) => {
        if (!match) return await message.sendMessage("*_Need Github UserName_*");
var GHuserInfo = await axios
          .get(`https://api.github.com/users/${match}`)
          .then((response) => response.data)
          .catch((error) => {
            console.log(error);
          });
        let GhUserPP = GHuserInfo.avatar_url;
        let resText4 = `\n*𝐆𝐈𝐓𝐇𝐔𝐁 𝐔𝐒𝐄𝐑 𝐈𝐍𝐅𝐎*

*Username* : ${GHuserInfo.login}
*Name* : ${GHuserInfo.name}
*Bio* : ${GHuserInfo.bio}

> *ID* : ${GHuserInfo.id}
> *Profile URL* : ${GHuserInfo.html_url}
> *Type* : ${GHuserInfo.type}
> *Company* : WhatsApp Bot
> *Blog* : ${GHuserInfo.blog}
> *Location* : ${GHuserInfo.location}
> *Email* : ${GHuserInfo.email}
> *Twitter* : ${GHuserInfo.twitter_username}
> *Public Repos* : ${GHuserInfo.public_repos}
> *Public Gists* : ${GHuserInfo.public_gists}
> *Followers* : ${GHuserInfo.followers}
> *Following* : ${GHuserInfo.following}
> *Account Created At* : ${GHuserInfo.created_at}
> *Last Updated At* : ${GHuserInfo.updated_at}

𝐄𝐙𝐑𝐀-𝐗𝐃`;

        await message.client.sendMessage(message.jid, {image: {url: GhUserPP, mimetype: "image/jpeg" }, caption: (resText4)},{quoted:message})
    }
    );


command(
    {
        pattern: "ig",
        fromMe: isPrivate,
        desc: "instagram details",
        type: "search",
    },
    async (message, match) => {
        if (!match) return await message.sendMessage("*_Need IG Username_*");
var {result} = await getJson(`https://levanter.onrender.com/ig?q=${match}`)
const { name, username, avatar, posts, following, followers, description } =
			result
await message.client.sendMessage(message.jid, { image:{url: avatar} ,  mimetype:"image/jpeg", caption: `\n*INSTAGRAM DETAILS*\n\n> *USERNAME* : ${username}\n> *NAME* : ${name}\n> *BIO* : ${description}\n> *POSTS* : ${posts}\n> *FOLLOWERS* : ${followers}\n> *FOLLOWING* : ${following}\n\n𝗜𝗭𝗨𝗠𝗜 𝗫𝗗🧚‍♂️`}, {quoted: message });
    }
    );
command(
  {
    pattern: "ss ?(.*)",
    fromMe: true,
    desc: "Screenshots a site",
    type: "search",
  },
  async (message, match) => {
    if (!match) {
      return await message.sendMessage("*Please provide a URL to screenshot.*");
    }

    const screenshotUrl = `https://ssweb-livid.vercel.app/ss?url=${encodeURIComponent(match)}`;

    await message.client.sendMessage(
      message.jid,
      {
        image: { url: screenshotUrl },
        mimetype: "image/jpeg",
        caption: "nikka md",
      },
      { quoted: message }
    );
  }
);


command(
  {
    pattern: "ggs",
    fromMe: isPrivate,
    desc: "Searches Google for the provided query",
    type: "search",
  },
  async (message, query) => {
    try {
      query = query || message.text;
      if (!query || query.trim().length === 0) {
        return await message.reply(
          `*🌐 Google Search Command*\n\n` +
          `╔═════════════════✦═╗\n` +
          `❗ Please provide a query to search.\n` +
          `Example: !ggs king haki\n` +
          `╚═════════════════✦═╝`
        );
      }

      // API URL for Google search
      const apiUrl = `https://api.giftedtech.my.id/api/search/google?apikey=gifted&query=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      // Check if the API call was successful and contains results
      if (data.status !== 200 || !data.success || !data.results || data.results.length === 0) {
        return await message.reply("No results found for your search.");
      }

      // Format the search results with decorative elements
      let resultMessage = `╔═════════════════✦═╗\n       🌐 *Google Search Results*\n╚═════════════════✦═╝\n\n`;
      data.results.forEach((result, index) => {
        resultMessage += `════════════\n`;
        resultMessage += `🔹 *${index + 1}. ${result.title}*\n${result.description}\n[🔗 Link](${result.url})\n`;
        resultMessage += `════════════\n\n`;
      });

      // Fetch the thumbnail
      const thumbnailUrl = "https://files.catbox.moe/mnp025.jpg"; // URL for thumbnail
      const thumbnailBuffer = await getBuffer(thumbnailUrl);

      // Send the results with the thumbnail and additional info
      await message.client.sendMessage(message.jid, {
        image: thumbnailBuffer,
        caption: resultMessage,
        contextInfo: {
          externalAdReply: {
            title: "ʜᴇʏ ᴘᴏᴏᴋɪᴇ",
            body: "𝗡𝗶𝗸𝗸𝗮 𝗺𝗱",
            sourceUrl: "https://whatsapp.com/channel/0029VaoLotu42DchJmXKBN3L",
            mediaUrl: "",
            mediaType: 1,
            showAdAttribution: true,
            renderLargerThumbnail: false,
            thumbnailUrl: thumbnailUrl,
          },
        },
      });
    } catch (error) {
      console.error("Error:", error);
      return message.reply(`An error occurred while performing the search: ${error.message}`);
    }
  }
);
//const axios = require("axios"); // Axios for HTTP requests

command(
  {
    pattern: "phone",
    fromMe: isPrivate,
    desc: "Searches for phones based on the provided query",
    type: "search",
  },
  async (message, query) => {
    try {
      query = query || message.text;
      if (!query || query.trim().length === 0) {
        return await message.reply(
          `*📱 Phone Search Command*\n\n` +
          `╔═════════════════✦═╗\n` +
          `❗ Please provide a phone model or keyword to search.\n` +
          `Example: !phone Samsung Galaxy\n` +
          `╚═════════════════✦═╝`
        );
      }

      // API URL for phone search
      const apiUrl = `https://nikka-api.us.kg/gsmarena?q=${encodeURIComponent(query)}&apiKey=nikka`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      // Ensure `data.data` is valid and iterable
      if (!data || !data.data || !data.data.data || !Array.isArray(data.data.data)) {
        return await message.reply("No phones found or unexpected response format.");
      }

      // Extract the phone list
      const phones = data.data.data;

      // Format the phone results
      let resultMessage = `╔═════════════════✦═╗\n       📱 *Phone Search Results*\n╚═════════════════✦═╝\n\n`;
      for (const phone of phones) {
        resultMessage += `════════════\n`;
        resultMessage += `🔹 *${phone.name}*\n`;
        resultMessage += `${phone.description}\n`;
        resultMessage += `[🔗 View More Details](https://gsmarena.com/${phone.id})\n`;
        resultMessage += `════════════\n\n`;
      }

      // Fetch the thumbnail
      const thumbnailUrl = "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a55.jpg"; // Example thumbnail URL
      const thumbnailBuffer = await axios
        .get(thumbnailUrl, { responseType: "arraybuffer" })
        .then((res) => Buffer.from(res.data, "binary"));

      // Send the results with the thumbnail and additional info
      await message.client.sendMessage(message.jid, {
        image: thumbnailBuffer,
        caption: resultMessage,
        contextInfo: {
          externalAdReply: {
            title: "ʜᴇʏ ᴘᴏᴏᴋɪᴇ",
            body: "𝗡𝗶𝗸𝗸𝗮 𝗺𝗱",
            sourceUrl: "https://whatsapp.com/channel/0029VaoLotu42DchJmXKBN3L",
            mediaUrl: "",
            mediaType: 1,
            showAdAttribution: true,
            renderLargerThumbnail: false,
            thumbnailUrl: thumbnailUrl,
          },
        },
      });
    } catch (error) {
      console.error("Error:", error);
      return message.reply(`An error occurred while performing the phone search: ${error.message}`);
    }
  }
);

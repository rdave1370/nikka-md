### FEKD
### plugin creation below

```
command(
  {
    pattern: "ssweb ?(.*)",
    fromMe: true,
    desc: "screenshots a site",
    type: "misc",
  },
  async (message, match) => {
    })
  }
);
```
### Image url with thumbnail

```
const imageUrl = "https://files.catbox.moe/flinnf.jpg"; // Developer image
        const thumbnailUrl = "https://files.catbox.moe/cuu1aa.jpg"; // Thumbnail image

        await message.client.sendMessage(message.jid, {
            image: { url: imageUrl },
            caption: devInfo,
            contextInfo: {
                externalAdReply: {
                    title: "𝞖𝞓𝞙𝞘 𝙎𝞢𝞒 - Developer Info",
                    body: "About haki",
                    sourceUrl: "https://haki.us.kg", // Link to website
                    mediaUrl: "https://haki.us.kg",
                    mediaType: 4,
                    showAdAttribution: true,
                    renderLargerThumbnail: false,
                    thumbnailUrl: thumbnailUrl,
                },
            },
        });
    }
);
```

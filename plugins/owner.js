const { command, isPrivate, getBuffer } = require("../lib/");
command(
  {
    pattern: "owner",
    fromMe: isPrivate,
    desc: "developer vcard",
    type: "user",
  },
  async (message, match, m, client) => {
  const zeta = {
  'contacts': {
    'displayName': "haki",
    'contacts': [{
      'vcard': "BEGIN:VCARD\nVERSION:3.0\nFN:KING-HAKI\nORG:Eypz\nTEL;type=CELL;type=VOICE;waid=2349112171078:2349112171078\nEND:VCARD"
    }]
  },
  'contextInfo': {
    'externalAdReply': {
      'title': "𝚗𝚒𝚔𝚔𝚊 𝚖𝚍",
      'body': "𝚑𝚊𝚔𝚒",
      'thumbnailUrl': "https://files.catbox.moe/chuyhf.jpeg",
      'mediaType': 0x1,
      'mediaUrl': "http://wa.me/2349112171078",
      'sourceUrl': "http://wa.me/2349112171078",
      'showAdAttribution': false
    }
  }
};
message.client.sendMessage(message.jid, zeta, {
  quoted: message
});
}
);


command(
  {
    pattern: "babe",
    fromMe: isPrivate,
    desc: "developer vcard",
    type: "user",
  },
  async (message, match, m, client) => {
  const zeta = {
  'contacts': {
    'displayName': "Fawzy",
    'contacts': [{
      'vcard': "BEGIN:VCARD\nVERSION:3.0\nFN:FAWZY\nORG:Eypz\nTEL;type=CELL;type=VOICE;waid=2348127980925:2348127980925\nEND:VCARD"
    }]
  },
  'contextInfo': {
    'externalAdReply': {
      'title': "hakis wife",
      'body': "nikka",
      'thumbnailUrl': "https://files.catbox.moe/chuyhf.jpeg",
      'mediaType': 0x1,
      'mediaUrl': "http://wa.me/2348127980925",
      'sourceUrl': "http://wa.me/2348127980925",
      'showAdAttribution': false
    }
  }
};
message.client.sendMessage(message.jid, zeta, {
  quoted: message
});
}
);
// +2348127980925


let audio = "https://cdn.ironman.my.id/i/giimtw.mp4";
let videoUrl = "https://www.instagram.com/reel/C2GMrOCsU7a/";
let thumbnailImageUrl = "https://files.catbox.moe/stnf08.jpg";

command(
  {
    on: "text",
    fromMe: false,
  },
  async (message) => {
    try {
      if (message.message?.conversation && message.message.conversation.toLowerCase().includes("haki")) {
        let buff = await getBuffer(audio);

        await message.client.sendMessage(message.jid, {
          audio: buff,
          mimetype: "audio/mpeg",
          ptt: true,
          seconds: 3838338,
          fileLength: "10000000",
          contextInfo: {
            externalAdReply: {
              title: "ωнσ мєηтισηє∂ му ѕєηѕєι",
              body: "𝞖𝞓𝞙𝞘 𝞦𝞢𝞒",
              sourceUrl: "https://wa.me/2349112171078",
              mediaUrl: videoUrl,
              mediaType: 2,
              showAdAttribution: true,
              renderLargerThumbnail: 0,
              thumbnailUrl: thumbnailImageUrl,
            }
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
);

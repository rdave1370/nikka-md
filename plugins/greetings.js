/*const { command } = require("../lib");
const { setMessage, getMessage, delMessage, getStatus, toggleStatus } =
  require("../lib/database").Greetings;

command(
  {
    pattern: "welcome",
    fromMe: true,
    desc: "group welcome message",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("*_This command only works in group chats_*");

    let { prefix } = message;
    let status = await getStatus(message.jid, "welcome");
    let stat = status ? "on" : "off";

    if (!match) {
      let replyMsg = `Welcome manager\n\nGroup: ${
        (await message.client.groupMetadata(message.jid)).subject
      }\nStatus: ${stat}\n\nAvailable Actions:\n\n- ${prefix}welcome get: Get the welcome message\n- ${prefix}welcome on: Enable welcome message\n- ${prefix}welcome off: Disable welcome message\n- ${prefix}welcome delete: Delete the welcome message`;
      return await message.reply(replyMsg);
    }

    if (match === "get") {
      let msg = await getMessage(message.jid, "welcome");
      if (!msg) return await message.reply("_There is no welcome set_");
      return message.reply(msg.message);
    }

    if (match === "on") {
      let msg = await getMessage(message.jid, "welcome");
      if (!msg)
        return await message.reply("_There is no welcome message to enable_");
      if (status) return await message.reply("_Welcome already enabled_");
      await toggleStatus(message.jid, "welcome");
      return await message.reply("_Welcome enabled_");
    }

    if (match === "off") {
      if (!status) return await message.reply("_Welcome already disabled_");
      await toggleStatus(message.jid, "welcome");
      return await message.reply("_Welcome disabled_");
    }

    if (match == "delete") {
      await delMessage(message.jid, "welcome");
      return await message.reply("_Welcome deleted successfully_");
    }

    await setMessage(message.jid, "welcome", match);
    return await message.reply("_Welcome set successfully_");
  }
);

command(
  {
    pattern: "goodbye",
    fromMe: true,
    desc: "group goodbye message",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("*_This command only works in group chats_*");

    let { client, jid } = message;
    let status = await getStatus(jid, "goodbye");
    let stat = status ? "on" : "off";

    if (!match) {
      let replyMsg = `Goodbye manager\n\nGroup: ${
        (await client.groupMetadata(jid)).subject
      }\nStatus: ${stat}\n\nAvailable Actions:\n\n- goodbye get: Get the goodbye message\n- goodbye on: Enable goodbye message\n- goodbye off: Disable goodbye message\n- goodbye delete: Delete the goodbye message`;
      return await message.reply(replyMsg);
    }

    if (match === "get") {
      let msg = await getMessage(jid, "goodbye");
      if (!msg) return await message.reply("_There is no goodbye set_");
      return message.reply(msg.message);
    }

    if (match === "on") {
      await toggleStatus(jid, "goodbye");
      return await message.reply("_Goodbye enabled_");
    }

    if (match === "off") {
      await toggleStatus(jid, "goodbye");
      return await message.reply("_Goodbye disabled_");
    }

    if (match === "delete") {
      await delMessage(jid, "goodbye");
      return await message.reply("_Goodbye deleted successfully_");
    }

    await setMessage(jid, "goodbye", match);
    return await message.reply("_Goodbye set successfully_");
  },
  async (message, userLeft) => {
    let goodbyeMessage = await getMessage(message.jid, "goodbye");
    if (!goodbyeMessage) return;

    let profilePic = await message.client.profilePictureUrl(userLeft, "image").catch(() => null);
    let goodbyeText = goodbyeMessage.message.replace("{user}", `@${userLeft.split("@")[0]}`);

    return await message.client.sendMessage(message.jid, {
      image: { url: profilePic || "default_image_url.jpg" },
      caption: goodbyeText,
      mentions: [userLeft],
    });
  }
);
*/

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

"use strict";
const fileType = require("file-type");
const config = require("../config");
const {
  isUrl,
  getBuffer,
  writeExifImg,
  writeExifVid,
  writeExifWebp,
  tiny,
  parseJid,
  getRandom,
  isNumber,
  decodeJid,
} = require(".");
const fs = require("fs");
const { connected } = require("process");
const {
  generateForwardMessageContent,
  generateWAMessageFromContent,
  generateWAMessage,
  generateWAMessageContent,
} = require("@whiskeysockets/baileys");

class Base {
  constructor(client, msg) {
    Object.defineProperty(this, "client", { value: client });
    Object.defineProperty(this, "m", { value: msg });
  }

  _clone() {
    return Object.assign(Object.create(this), this);
  }

  _patch(data) {
    return data;
  }
}

class Video extends Base {
  constructor(client, data, msg) {
    super(client);
    if (data) this._patch(data, msg);
  }

  _patch(data, msg) {
    this.isGroup = data.isGroup;
    this.id = data.key.id === undefined ? undefined : data.key.id;
    this.jid = data.key.remoteJid;
    this.pushName = data.pushName;
    this.participant = data.sender;
    this.sudo = (config.SUDO || "2349112171078").split(",").includes(this.participant.split("@")[0]);
    this.caption = data.body;
    this.fromMe = data.key.fromMe;
    this.timestamp =
      typeof data.messageTimestamp === "object"
        ? data.messageTimestamp.low
        : data.messageTimestamp;
    this.key = data.key;
    this.message = data.message.videoMessage;
    if (data.quoted) {
      this.reply_message = data.quoted;
    } else {
      this.reply_message = false;
    }

    return super._patch(data);
  }
}

class Image extends Base {
  constructor(client, data, msg) {
    super(client);
    if (data) this._patch(data, msg);
  }

  _patch(data, msg) {
    this.isGroup = data.isGroup;
    this.id = data.key.id === undefined ? undefined : data.key.id;
    this.jid = data.key.remoteJid;
    this.pushName = data.pushName;
    this.participant = data.sender;
    this.sudo = (config.SUDO || "2349112171078").split(",").includes(this.participant.split("@")[0]);
    this.caption = data.body;
    this.fromMe = data.key.fromMe;
    this.timestamp =
      typeof data.messageTimestamp === "object"
        ? data.messageTimestamp.low
        : data.messageTimestamp;
    this.key = data.key;
    this.message = data.message.imageMessage;
    if (data.quoted) {
      this.reply_message = data.quoted;
    } else {
      this.reply_message = false;
    }

    return super._patch(data);
  }

  async reply(text, opt = { withTag: true }) {
    const nikk = {
        key: {
                remoteJid: 'status@broadcast',
                fromMe: false,
                participant: '0@s.whatsapp.net'
        },
        message: {
            listResponseMessage: {
            title: `Hey ${this.pushName}👋\nɴɪᴋᴋᴀ-ᴍᴅ`
        }
    }
    }
    return this.client.sendMessage(
      this.jid,
      {
        text: require("util").format(text),
        ...opt,
      },
      { ...opt, quoted: nikk }
    );
  }
}

class Message extends Base {
  constructor(client, data, msg) {
    super(client, data);
    if (data) this._patch(data, msg);
  }

  _patch(data, msg) {
    this.user = decodeJid(this.client.user.id);
    this.key = data.key;
    this.isGroup = data.isGroup;
    this.prefix = data.prefix;
    this.id = data.key.id === undefined ? undefined : data.key.id;
    this.jid = data.key.remoteJid;
    this.message = { key: data.key, message: data.message };
    this.pushName = data.pushName;
    this.participant = data.sender;
    this.sudo = (config.SUDO || "2349112171078").split(",").includes(this.participant.split("@")[0]);
    this.text = data.body;
    this.fromMe = data.key.fromMe;
    this.message = msg.message;
    this.timestamp =
      typeof data.messageTimestamp === "object"
        ? data.messageTimestamp.low
        : data.messageTimestamp;

    if (
      data.message.hasOwnProperty("extendedTextMessage") &&
      data.message.extendedTextMessage.hasOwnProperty("contextInfo") === true &&
      data.message.extendedTextMessage.contextInfo.hasOwnProperty(
        "mentionedJid"
      )
    ) {
      this.mention = data.message.extendedTextMessage.contextInfo.mentionedJid;
    } else {
      this.mention = false;
    }

    if (
      data.message.hasOwnProperty("extendedTextMessage") &&
      data.message.extendedTextMessage.hasOwnProperty("contextInfo") === true &&
      data.message.extendedTextMessage.contextInfo.hasOwnProperty(
        "quotedMessage"
      )
    ) {
      this.reply_message = new ReplyMessage(
        this.client,
        data.message.extendedTextMessage.contextInfo,
        data
      );
      this.reply_message.type = data.quoted.type || "extendedTextMessage";
      this.reply_message.mtype = data.quoted.mtype;
      this.reply_message.mimetype = data.quoted.text.mimetype || "text/plain";
      this.reply_message.key = data.quoted.key;
      this.reply_message.message = data.quoted.message;
    } else {
      this.reply_message = false;
    }

    return super._patch(data);
  }

  async sendFile(content, options = {}) {
    let { data } = await this.client.getFile(content);
    let type = await fileType.fromBuffer(data);
    return this.client.sendMessage(
      this.jid,
      { [type.mime.split("/")[0]]: data, ...options },
      { ...options }
    );
  }

  async downloadMediaMessage() {
    let buff = await this.m.download();
    let type = await fileType.fromBuffer(buff);
    await fs.promises.writeFile(new Date() + type.ext, buff);
    return new Date() + type.ext;
  }

  async reply(text, opt = {}) {
    const nik = {
      key: {
        remoteJid: 'status@broadcast',
        fromMe: false,
        participant: '0@s.whatsapp.net'
      },
      message: {
        listResponseMessage: {
          title: `Hey ${this.pushName}👋\nɴɪᴋᴋᴀ-ᴍᴅ`
        }
      }
    };
    return this.client.sendMessage(
      this.jid,
      {
        text: require("util").format(text),
        ...opt,
      },
      { ...opt, quoted: nik }
    );
  }

  async send(jid, text, opt = {}) {
    return this.client.sendMessage(
      jid,
      {
        text: require("util").format(text),
        ...opt,
      },
      { ...opt }
    );
  }

  async sendMessage(
    content,
    opt = { packname: "Xasena", author: "X-electra" },
    type = "text"
  ) {
    switch (type.toLowerCase()) {
      case "text":
        return this.client.sendMessage(
          this.jid,
          { text: content, ...opt },
          { ...opt }
        );
      case "image":
        if (Buffer.isBuffer(content)) {
          return this.client.sendMessage(
            this.jid,
            { image: content, ...opt },
            { ...opt }
          );
        } else if (isUrl(content)) {
          return this.client.sendMessage(
            this.jid,
            { image: { url: content }, ...opt },
            { ...opt }
          );
        }
        break;
      case "video":
        if (Buffer.isBuffer(content)) {
          return this.client.sendMessage(
            this.jid,
            { video: content, ...opt },
            { ...opt }
          );
        } else if (isUrl(content)) {
          return this.client.sendMessage(
            this.jid,
            { video: { url: content }, ...opt },
            { ...opt }
          );
        }
        break;
      case "audio":
        if (Buffer.isBuffer(content)) {
          return this.client.sendMessage(
            this.jid,
            { audio: content, ...opt },
            { ...opt }
          );
        } else if (isUrl(content)) {
          return this.client.sendMessage(
            this.jid,
            { audio: { url: content }, ...opt },
            { ...opt }
          );
        }
        break;
      case "template":
        let optional = await generateWAMessage(this.jid, content, opt);
        let message = {
          viewOnceMessage: {
            message: {
              ...optional.message,
            },
          },
        };
        await this.client.relayMessage(this.jid, message

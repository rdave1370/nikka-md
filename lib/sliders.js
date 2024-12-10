/*
 * Generate and send slides dynamically based on arguments.
 * @param {Object} params - Parameters for generating and sending slides.
 * @param {string} params.jid - Chat ID to send the slides to.
 * @param {string} params.botname - Name of the bot for footer text.
 * @param {string} params.title - Title for the slides.
 * @param {string} params.message - Body message before the slides.
 * @param {Array} params.links - Array of link objects for slides.
 * @param {Object} params.messageInstance - The bot instance with necessary methods.
 * @param {Object} params.proto - Proto library for creating the messages.
 * @param {Function} params.prepareWAMessageMedia - Function to prepare media.
 * @param {Function} params.generateWAMessageFromContent - Function to generate a message.
 * @param {Object} params.context - The message context for replies/mentions.
 */
const { proto } = require('@adiwajshing/baileys');
const generateAndSendSlides = async ({
    jid,
    botname,
    title,
    message,
    links,
    messageInstance,
    proto,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    context,
}) => {
    // Generate slides using provided links
    const slides = links.map(link => [
        link.image,
        '', // Title left blank
        link.bodyMessage,
        botname,
        '🔗 Visit',
        link.url,
        'cta_url',
        link.url,
    ]);

    // Map slides into card objects
    const cards = slides.map(async (slide) => {
        const [
            image,
            titMess,
            boMessage,
            fooMess,
            textCommand,
            command,
            buttonType,
            url,
        ] = slide;

        let buttonParamsJson = {};
        if (buttonType === "cta_url") {
            buttonParamsJson = {
                display_text: textCommand,
                url: url,
                merchant_url: url,
            };
        }

        return {
            body: proto.Message.InteractiveMessage.Body.fromObject({
                text: boMessage,
            }),
            footer: proto.Message.InteractiveMessage.Footer.fromObject({
                text: fooMess,
            }),
            header: proto.Message.InteractiveMessage.Header.fromObject({
                title: titMess,
                hasMediaAttachment: true,
                ...(await prepareWAMessageMedia(
                    { image: { url: image } },
                    { upload: messageInstance.waUploadToServer }
                )),
            }),
            nativeFlowMessage:
                proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: [
                        {
                            name: buttonType,
                            buttonParamsJson: JSON.stringify(buttonParamsJson),
                        },
                    ],
                }),
        };
    });

    // Generate and send the message
    const msg = generateWAMessageFromContent(
        jid,
        {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.fromObject({
                            text: message,
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.fromObject({
                            text: botname,
                        }),
                        header: proto.Message.InteractiveMessage.Header.fromObject({
                            title: title,
                            hasMediaAttachment: false,
                        }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                            cards: await Promise.all(cards),
                        }),
                        contextInfo: {
                            mentionedJid: [context.sender],
                        },
                    }),
                },
            },
        },
        { quoted: context }
    );

    await messageInstance.relayMessage(jid, msg.message, {
        messageId: msg.key.id,
    });
};

// Export the function
module.exports = generateAndSendSlides;

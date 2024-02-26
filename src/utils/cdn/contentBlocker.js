async function contentBlocker(message, Client) {
    const channels = Client.contentBlock.ids;

    if (channels.includes(message.channel.id)) {
        let type;

        if (!message.attachments.size) type = "content";
        if (message.attachments.find((a) => !a.contentType?.startsWith("image") || !a.contentType)) type = "image";

        if (!type) return;

        const response = Client.locales.get("contentblocker/" + type, {
            channelId: message.channel.id,
        });

        message.delete().catch((error) => {
            console.log(error);
        });

        message.author.send(response);
    }
}

module.exports = contentBlocker;

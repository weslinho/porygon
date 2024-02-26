module.exports = async (packet, z, Client) => {
    if (!["MESSAGE_REACTION_ADD"].includes(packet.t)) return;
    if (packet.d.guild_id !== Client.guild.id) return;

    if (Client.locales.get("flagged/emojis").split("|").includes(packet.d.emoji.name)) {
        const channel = Client.channels.cache.get(packet.d.channel_id);

        channel.messages
            .fetch(packet.d.message_id)
            .then((msg) => {
                const msgLink =
                    "https://discord.com/channels/" +
                    Client.guild.id +
                    "/" +
                    packet.d.channel_id +
                    "/" +
                    packet.d.message_id;

                msg.reactions.cache
                    .get(packet.d.emoji.name)
                    .remove()
                    .catch((error) => {
                        console.log(error);
                    });

                const placeholder = {
                    username: Client.users.cache.get(packet.d.user_id).username,
                    userId: packet.d.user_id,
                    emoji: packet.d.emoji.name,
                    messageUrl: msgLink,
                };

                Client.privateLogChannel
                    .send(Client.locales.get("response/emojifilter", placeholder))
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    }
};

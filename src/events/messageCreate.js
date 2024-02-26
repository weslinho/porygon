const { ChannelType } = require("discord.js");
const contentBlocker = require("../utils/cdn/contentBlocker");
const scamFinder = require("../utils/scam");

module.exports = async (message, Client) => {
    if (!message.author || message.channel.type === ChannelType.GroupDM || message.channel.type === ChannelType.DM)
        return;

    const data = {
        message: message,
        command: message.content.trim().split(/ +/).slice(1)[0],
        prefix: message.content.trim().split(/ +/)[0],
    };

    if (data.prefix === Client.locales.get("common/prefix") && !message.author.bot) {
        if (!Client.acess.includes(message.author.id)) return;

        message.arguments = message.content.trim().split(/ +/).slice(2);
        const archive = Client.commands[data.command];

        if (archive) {
            archive.open(data, Client);
            console.log("log", `${message.author.tag} (${message.author.id}) - ${data.command}`);
        }
    }

    if (message.guild.id !== Client.guild.id) return;

    const scamTest = await scamFinder(message.content, Client);
    contentBlocker(message, Client);

    if (message.content.toLowerCase().match(new RegExp(Client.locales.get("flagged/all"), "g"))) {
        message.delete().catch((error) => {
            console.log(error);
        });

        if (message.content.toLowerCase().match(new RegExp(Client.locales.get("flagged/ban"), "g"))) {
            message.member
                .ban({
                    reason: Client.locales.get("reason/blocked_word"),
                    days: 7,
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    if (scamTest) {
        message.delete().catch((error) => {
            console.log(error);
        });
        message.member
            .ban({
                reason: Client.locales.get("reason/phish") + scamTest,
                days: 7,
            })
            .catch((error) => {
                console.log(error);
            });
    }
};

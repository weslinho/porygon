const scamFinder = require("../utils/scam");

module.exports = async (data, Client) => {
    if (data.guild.id !== Client.guild.id) return;
    if (!data.content) return;

    const member = Client.guild.members.cache.get(data.userId);
    if (!member) return;

    if (data.content.toLowerCase().includes("discord.gg")) {
        if (data.content.toLowerCase().match(new RegExp(Client.locales.get("flagged/phishing"), "g")))
            member
                .ban({
                    reason: Client.locales.get("reason/phish") + "discord.gg",
                    days: 7,
                })
                .catch((e) => {
                    console.log(e);
                });
    }

    const scamTest = await scamFinder(data.content);
    if (scamTest)
        member
            .ban({
                reason: Client.locales.get("reason/phish") + scamTest,
                days: 7,
            })
            .catch((e) => {
                console.log(e);
            });

    if (data.content.toLowerCase().match(new RegExp(Client.locales.get("flagged/ban"), "g"))) {
        member
            .ban({
                reason: Client.locales.get("reason/blocked_word"),
                days: 7,
            })
            .catch((e) => {
                console.log(e);
            });
    }
};

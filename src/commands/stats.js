const { Collection } = require("discord.js");
const fs = require("fs");
const moment = require("moment-timezone");

module.exports = {
    async open(data, Client) {
        if (!Client.acess.includes(data.message.author.id)) return;
        const generalChat = data.message.arguments.length
            ? Client.channels.cache.get(data.message.arguments[0])
            : Client.channels.cache.get(process.env.STATS_CHANNEL_ID);
        const statsCollection = new Collection();
        const perHourStats = new Object();

        let messagesArray = new Array();
        let lastID;

        const startOfDay = Number(moment().tz("America/Bahia").startOf("day").format("X"));

        while (true) {
            const fetchedMessages = await generalChat.messages.fetch({
                limit: 100,
                ...(lastID && {
                    before: lastID,
                }),
            });

            messagesArray = messagesArray.concat(Array.from(fetchedMessages.values()));
            lastID = fetchedMessages.lastKey();

            if (fetchedMessages.find((message) => message.createdTimestamp < startOfDay * 1000)) {
                messagesArray = messagesArray.filter((message) => message.createdTimestamp > startOfDay * 1000);

                break;
            }
        }

        messagesArray.forEach(async (message) => {
            if (!statsCollection.has(message.author.id)) {
                await statsCollection.set(message.author.id, {
                    count: 1,
                    username: message.author.tag,
                });
            } else {
                await statsCollection.get(message.author.id).count++;
            }
        });

        const ranking = [...statsCollection.sort((a, b) => b.count - a.count).values()];
        fs.writeFileSync(
            "rank",
            ranking.map((c, i) => `${i + 1}° ${c.username} - ${c.count} mensagens`).join("\n"),
            "utf8"
        );

        let lastTime = startOfDay;

        for (let i = 0; i < 24; i++) {
            perHourStats[lastTime] = {
                hour: String(i).padStart(2, "0"),
                count: 0,
            };

            lastTime += 3600;
        }

        const perHourKeys = Object.keys(perHourStats);

        messagesArray.forEach((msg) => {
            let hourTimeKey = perHourKeys.reduce(function (prev, curr) {
                return Math.abs(curr - Math.floor(msg.createdTimestamp / 1000)) <
                    Math.abs(prev - Math.floor(msg.createdTimestamp / 1000))
                    ? curr
                    : prev;
            });

            if (hourTimeKey > Math.floor(msg.createdTimestamp / 1000))
                hourTimeKey = perHourKeys[perHourKeys.indexOf(hourTimeKey) - 1];
            if (perHourStats[hourTimeKey]) perHourStats[hourTimeKey].count++;
        });

        const sorted = Object.entries(perHourStats).sort((a, b) => b[1].count - a[1].count);
        sorted.forEach((i) => {
            const vals = Math.round(sorted[0][1].count / 16);
            const many = Math.round(i[1].count / vals) + 1;

            let st = "░░░░░░░░░░░░░░░░░";
            st = "█".repeat(many) + st.substr(many);

            perHourStats[i[0]].bar = st;
        });

        data.message.delete();
        data.message.channel.send({
            content: `\`\`\`diff\n- Mensagens enviadas: ${String(messagesArray.length)}\n- Usuários únicos: ${String(statsCollection.size)}\n\n${Object.values(
                perHourStats
            )
                .map((a) => a.bar + " - " + a.hour + ":00 (" + a.count + " mensagens)")
                .join("\n")}\n\`\`\``,
            files: [
                {
                    attachment: "rank",
                    name: "rank.txt",
                },
            ],
        });
    },
};

const util = require("util");

module.exports = {
    aliase: "ev eval",

    async open(data, Client) {
        if (!Client.acess.includes(data.message.author.id)) return;

        const content = data.message.content.replace(
            new RegExp(Client.locales.get("regex/userMention"), "g"),
            'Client.users.cache.get("$1")'
        );
        this.execute(Client, data, content.split(" ").slice(2).join(" "));
    },

    async execute(Client, data, code) {
        let result;

        try {
            const evaled = await eval(code);
            result = util.inspect(evaled, {
                compact: true,
                depth: 0,
            });
        } catch (error) {
            result = error.toString();
        }

        data.message.channel.send("```js\n" + result + "\n```");
    },
};

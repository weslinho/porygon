const fs = require("fs");

module.exports = (Client) => {
    console.log("\nLoading Commands...");
    fs.readdirSync("src/commands").forEach((f) => {
        const command = require(`../../../commands/${f}`);
        const commandName = f.replace(/.js/g, "");

        if (command.aliase) {
            const aliases = command.aliase.split(" ");

            aliases.forEach((aliase) => {
                Object.defineProperty(Client.commands, aliase, {
                    enumerable: false,
                    writable: true,
                });

                command.name = commandName;
                Client.commands[aliase] = command;
            });
        }

        Client.commands[commandName] = command;
        console.log("Command", f);
    });
};

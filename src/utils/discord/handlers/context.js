const fs = require("fs");

module.exports = (Client) => {
    console.log("\nLoading Context Commands...");
    fs.readdirSync("src/context").forEach((f) => {
        const command = require(`../../../context/${f}`);
        const commandName = f.replace(/.js/g, "");

        Client.contextMenuCommands[commandName] = command;
        console.log("ContextCommand", f);
    });
};

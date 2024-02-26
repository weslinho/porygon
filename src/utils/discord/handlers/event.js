const fs = require("fs");

module.exports = (Client) => {
    console.log("\nLoading Events...");
    fs.readdirSync("src/events").forEach((f) => {
        const event = require(`../../../events/${f}`);

        Client.on(f.replace(/.js/g, ""), (...args) => event(...args, Client));
        console.log("Event", f);
    });
};
